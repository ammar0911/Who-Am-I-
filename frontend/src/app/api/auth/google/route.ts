import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    // Get the userId from the request query params
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    // Initialize the OAuth2 client with your credentials
    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    );

    // Define the scopes required for accessing calendar data and user info
    const scopes = [
        'https://www.googleapis.com/auth/calendar.readonly',
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
    ];

    // Generate the authentication URL
    // 'offline' access type gets a refresh token
    // 'consent' prompt ensures the user is prompted for consent, which is good for getting a refresh token on subsequent logins
    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        prompt: 'consent',
        // Add state parameter with userId to retrieve it in the callback
        state: userId ? JSON.stringify({ userId }) : undefined,
    });

    // Return the URL as a JSON response instead of redirecting
    return NextResponse.json({ url });
}