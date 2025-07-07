import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';
import { userApi } from '@/lib/firestoreApi';

interface UserSettings {
  googleAuth?: {
    accessToken: string;
    refreshToken: string;
    expiryDate: number;
    updatedAt: string;
  };
  selectedCalendars?: string[];
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const user = await userApi.getById(userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let userSettings: UserSettings = {};
    try {
      userSettings = user.userSettings
        ? (JSON.parse(user.userSettings) as UserSettings)
        : {};
    } catch (e) {
      console.error('Error parsing user settings:', e);
      return NextResponse.json(
        { error: 'Invalid user settings' },
        { status: 500 }
      );
    }

    if (!userSettings.googleAuth?.accessToken) {
      return NextResponse.json(
        { error: 'User not connected to Google Calendar' },
        { status: 400 }
      );
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    oauth2Client.setCredentials({
      access_token: userSettings.googleAuth.accessToken,
      refresh_token: userSettings.googleAuth.refreshToken,
      expiry_date: userSettings.googleAuth.expiryDate,
    });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    const calendarList = await calendar.calendarList.list();

    return NextResponse.json(calendarList.data);
  } catch (error: unknown) {
    console.error(
      'Error fetching calendars:',
      error instanceof Error ? error.message : String(error)
    );
    return NextResponse.json(
      { error: 'Failed to fetch calendars' },
      { status: 500 }
    );
  }
}
