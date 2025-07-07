import { userApi, workingBlockApi } from '@/lib/firestoreApi';
import mapGoogleCalendarEventToWorkingBlock from '@/lib/mapGoogleCalendarEventToNewWorkingBlock';
import { GoogleCalendarEvent, UserSettings } from '@/types';

import googleAPIs from '@googleapis/calendar';

googleAPIs.calendar('v3');

const oauth2Client = new googleAPIs.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI,
);

const retrieveAndSaveGoogleCalendarEvents = async () => {
  const userDTOs = await userApi.getAll();

  const userCalendarPromises = userDTOs.map(async (user) => {
    const userSettings = JSON.parse(user.userSettings || '{}') as UserSettings;
    const { googleAuth, selectedCalendars } = userSettings;

    if (!googleAuth || !selectedCalendars?.length) {
      console.warn(
        `Skipping user ${user.id} due to missing Google Calendar settings.`,
      );
      return;
    }

    const { accessToken, expiryDate, refreshToken } = googleAuth;
    if (!accessToken) {
      console.warn(`Skipping user ${user.id} due to missing access token.`);
      return;
    }

    try {
      oauth2Client.setCredentials({
        access_token: accessToken,
        refresh_token: refreshToken,
        expiry_date: expiryDate,
      });

      oauth2Client.on('tokens', (tokens) => {
        if (tokens.access_token) {
          console.log(
            `New access token for user ${user.id}:`,
            tokens.access_token,
          );
        }
        if (tokens.refresh_token) {
          console.log(
            `New refresh token for user ${user.id}:`,
            tokens.refresh_token,
          );
        }
        // Update the user's Google auth tokens in the database
        userApi.update(user.id, {
          user_settings: JSON.stringify({
            ...userSettings,
            googleAuth: {
              ...googleAuth,
              accessToken: tokens.access_token,
              refreshToken: tokens.refresh_token || googleAuth.refreshToken,
              expiryDate: tokens.expiry_date || googleAuth.expiryDate,
            },
          }),
        });
      });

      // Create calendar API instance
      const calendar = googleAPIs.calendar({
        version: 'v3',
        auth: oauth2Client,
      });

      const selectedCalendarsPromises = selectedCalendars.map(
        async (calendarId) => {
          try {
            const response = await calendar.events.list({
              calendarId: calendarId,
              timeMin: new Date().toISOString(),
              timeMax: new Date(
                Date.now() + 7 * 24 * 60 * 60 * 1000, // Next 7 days
              ).toISOString(),
              maxResults: 50,
              singleEvents: true,
              orderBy: 'startTime',
            });

            const events = response.data.items || [];
            console.log(
              `Found ${events.length} events for user ${user.id} in calendar ${calendarId}`,
            );

            const eventPromises = events.map((event) =>
              processAndSaveEvent(
                {
                  id: event.id || '',
                  start: {
                    dateTime: event.start?.dateTime || '',
                    date: event.start?.date || '',
                  },
                  end: {
                    dateTime: event.end?.dateTime || '',
                    date: event.end?.date || '',
                  },
                },
                user.id,
              ),
            );

            return Promise.all(eventPromises);
          } catch (calendarError) {
            console.error(
              `Error fetching events from calendar ${calendarId} for user ${user.id}:`,
              calendarError,
            );
          }
        },
      );
      return Promise.all(selectedCalendarsPromises);
    } catch (error) {
      console.error(`Error processing user ${user.id}:`, error);

      const errorMessage =
        (error as Record<string, unknown>)?.message || 'Unknown error';

      if (errorMessage) {
        console.warn(
          `Token expired for user ${user.id}, may need to re-authenticate`,
        );
        // @TODO: mark the user's auth as expired in database
      }
    }
  });

  await Promise.all(userCalendarPromises);
};

const processAndSaveEvent = async (
  event: GoogleCalendarEvent,
  userId: string,
) => {
  try {
    const workingBlock = mapGoogleCalendarEventToWorkingBlock(event, userId);

    await workingBlockApi.create(workingBlock, {
      source: 'Calendar',
    });
  } catch (error) {
    console.error(`Error processing event ${event.id}:`, error);
  }
};

export default retrieveAndSaveGoogleCalendarEvents;
