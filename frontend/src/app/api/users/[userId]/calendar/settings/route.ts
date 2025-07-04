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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    // Get request body
    const body = await request.json();
    const { calendarIds } = body;

    if (!Array.isArray(calendarIds)) {
      return NextResponse.json(
        { error: 'calendarIds must be an array' },
        { status: 400 }
      );
    }

    // Get the user
    const user = await userApi.getById(userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Parse user settings
    let userSettings: UserSettings = {};
    try {
      userSettings = user.userSettings
        ? (JSON.parse(user.userSettings) as UserSettings)
        : {};
    } catch (e) {
      console.error('Error parsing user settings:', e);
    }

    // Update selected calendars
    const updatedSettings: UserSettings = {
      ...userSettings,
      selectedCalendars: calendarIds,
    };

    // Save to database
    await userApi.update(userId, {
      user_settings: JSON.stringify(updatedSettings),
    });

    return NextResponse.json({
      message: 'Calendars saved successfully',
      selectedCalendars: calendarIds,
    });
  } catch (error: unknown) {
    console.error(
      'Error saving calendars:',
      error instanceof Error ? error.message : String(error)
    );
    return NextResponse.json(
      { error: 'Failed to save calendars' },
      { status: 500 }
    );
  }
}
