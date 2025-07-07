import { google } from 'googleapis';
import { NextRequest } from 'next/server';
import { userApi } from '@/lib/firestoreApi';
import retrieveAndSaveGoogleCalendarEvents from '@/webhooks/retrieveAndSaveGoogleCalendarEvents';

// This function generates the HTML response that will be sent to the popup window.
const createCallbackResponse = (
  status: 'success' | 'error',
  error?: string,
) => {
  const message = JSON.stringify({ status, error });
  return new Response(
    `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Authentication Complete</title>
        </head>
        <body>
          <script>
            // Send the message to the parent window that opened this popup
            if (window.opener) {
              window.opener.postMessage(${message}, window.location.origin);
            }
            window.close();
          </script>
          <p>Authentication complete. You can close this window.</p>
        </body>
      </html>
    `,
    {
      headers: {
        'Content-Type': 'text/html',
      },
    },
  );
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  let userId: string | null = null;
  if (state) {
    try {
      const stateObj = JSON.parse(state);
      userId = stateObj.userId || null;
    } catch (e) {
      console.error('Error parsing state parameter:', e);
    }
  }

  if (!code) {
    return createCallbackResponse('error', 'Authorization code not found.');
  }

  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI,
    );

    const { tokens } = await oauth2Client.getToken(code);
    const { access_token, refresh_token, expiry_date } = tokens;

    console.log('--- Google OAuth Tokens Received ---');
    console.log('Access Token:', access_token);
    console.log('Refresh Token:', refresh_token);
    console.log('Expiry Date:', expiry_date);
    console.log('------------------------------------');
    console.log('User ID from state:', userId);

    // Update user settings in database if userId is available
    if (userId) {
      try {
        const user = await userApi.getById(userId);

        if (user) {
          let userSettings = {};
          try {
            userSettings = user.userSettings
              ? JSON.parse(user.userSettings)
              : {};
          } catch (e) {
            console.error('Error parsing user settings:', e);
          }

          const updatedSettings = {
            ...userSettings,
            googleAuth: {
              accessToken: access_token,
              refreshToken: refresh_token,
              expiryDate: expiry_date,
              updatedAt: new Date().toISOString(),
            },
          };

          // Update user in database
          await userApi.update(userId, {
            user_settings: JSON.stringify(updatedSettings),
          });

          // Trigger retrieve calendars
          await retrieveAndSaveGoogleCalendarEvents();

          console.log('User settings updated with Google OAuth tokens');
        } else {
          console.error('User not found with ID:', userId);
        }
      } catch (error) {
        console.error('Error updating user settings:', error);
      }
    } else {
      console.log('No userId found in cookies, skipping user settings update');
    }

    const response = createCallbackResponse('success');

    // Set the access token in an httpOnly cookie for future API calls from the server
    if (access_token) {
      response.headers.append(
        'Set-Cookie',
        `google-access-token=${access_token}; HttpOnly; Path=/; Max-Age=${tokens.expiry_date! - Date.now() / 1000}`,
      );
    }
    if (refresh_token) {
      response.headers.append(
        'Set-Cookie',
        `google-refresh-token=${refresh_token}; HttpOnly; Path=/; Max-Age=31536000`,
      ); // Expires in 1 year
    }

    return response;
  } catch (error: unknown) {
    console.error(
      'Error exchanging code for tokens:',
      error instanceof Error ? error.message : String(error),
    );
    return createCallbackResponse(
      'error',
      'Failed to authenticate with Google.',
    );
  }
}
