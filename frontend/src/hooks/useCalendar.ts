import { CalendarEvent, WorkingBlockDTO } from '@/types';
import { useCallback, useEffect, useState } from 'react';

const useCalendar = (userId: string | null) => {
  const [isConnectedToGoogle, setIsConnectedToGoogle] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [selectedCalendarIds, setSelectedCalendarIds] = useState<string[]>([]);
  const [availableCalendars, setAvailableCalendars] = useState<
    Array<{ id: string; summary: string }>
  >([]);
  const [isLoadingCalendars, setIsLoadingCalendars] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Connect to Google Calendar
  const connectGoogleCalendar = async () => {
    try {
      // Pass the current user ID to the Google OAuth endpoint
      const response = await fetch(`/api/auth/google?userId=${userId}`);
      const data = await response.json();

      if (!response.ok || !data.url) {
        throw new Error(data.error || 'Failed to get authentication URL');
      }

      // Open popup for OAuth flow
      const popup = window.open(
        data.url,
        'google-auth',
        'width=600,height=700',
      );

      // Listen for message from popup
      window.addEventListener(
        'message',
        (event) => {
          if (event.origin !== window.location.origin) {
            return;
          }

          const { status, error } = event.data;

          if (status === 'success') {
            console.log('Google Calendar connected successfully!');
            setIsConnectedToGoogle(true);
            fetchAvailableCalendars();

            if (popup) popup.close();
          } else {
            console.error('Authentication failed:', error);
            if (popup) popup.close();
          }
        },
        { once: true },
      );
    } catch (error) {
      console.error('Error initiating Google Calendar connection:', error);
    }
  };

  const disconnectGoogleCalendar = async () => {
    // Implementation for disconnecting from Google Calendar
    if (!userId) return;

    try {
      // This would need an API endpoint to remove Google tokens from user settings
      // For now, we'll just update the UI state
      setIsConnectedToGoogle(false);
      setAvailableCalendars([]);
      setSelectedCalendarIds([]);

      // TODO: Add API call to remove Google tokens from user settings
      console.log('Disconnected from Google Calendar');
    } catch (error) {
      console.error('Error disconnecting from Google Calendar:', error);
    }
  };

  const onCalendarSelectionChange = (selectedIds: string[]) => {
    setSelectedCalendarIds(selectedIds);
  };

  // Function to fetch available calendars
  const fetchAvailableCalendars = useCallback(async () => {
    if (!userId) return;

    setIsLoadingCalendars(true);
    try {
      const response = await fetch(`/api/users/${userId}/calendar`);
      if (!response.ok) {
        throw new Error(`Failed to fetch calendars: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.items && Array.isArray(data.items)) {
        const calendars = data.items.map(
          (cal: { id: string; summary?: string }) => ({
            id: cal.id,
            summary: cal.summary || 'Unnamed Calendar',
          }),
        );

        setAvailableCalendars(calendars);
      }
    } catch (error) {
      console.error('Error fetching calendars:', error);
    } finally {
      setIsLoadingCalendars(false);
    }
  }, [userId]);

  // Function to fetch user's calendar settings
  const fetchUserCalendarSettings = useCallback(async () => {
    if (!userId) return;

    try {
      const response = await fetch(`/api/users/${userId}`);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch user settings: ${response.statusText}`,
        );
      }

      const userData = await response.json();
      if (userData.userSettings) {
        try {
          const settings = JSON.parse(userData.userSettings);

          if (settings.googleAuth?.accessToken) {
            setIsConnectedToGoogle(true);
            fetchAvailableCalendars();
          }

          if (
            settings.selectedCalendars &&
            Array.isArray(settings.selectedCalendars)
          ) {
            setSelectedCalendarIds(settings.selectedCalendars);
          }
        } catch (e) {
          console.error('Error parsing user settings:', e);
        }
      }
    } catch (error) {
      console.error('Error fetching user settings:', error);
    }
  }, [userId, fetchAvailableCalendars]);

  // Function to save selected calendars
  const saveSelectedCalendars = useCallback(async () => {
    if (!userId) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/users/${userId}/calendar/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ calendarIds: selectedCalendarIds }),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to save calendar settings: ${response.statusText}`,
        );
      }

      // Show success notification or feedback
      console.log('Calendar settings saved successfully');
    } catch (error) {
      console.error('Error saving calendar settings:', error);
    } finally {
      setIsSaving(false);
    }
  }, [userId, selectedCalendarIds]);

  useEffect(() => {
    if (userId) {
      const fetchWorkingBlocks = async () => {
        try {
          const response = await fetch(
            `/api/users/${userId}/workingBlock/forFollowingWeek`,
          );
          if (!response.ok) {
            throw new Error(
              `Failed to fetch working blocks: ${response.statusText}`,
            );
          }

          const workingBlocks = await response.json();

          if (!workingBlocks || workingBlocks.length === 0) {
            console.log('No working blocks found for this user');
            setCalendarEvents([]);
            return;
          }

          const events: CalendarEvent[] = workingBlocks.map(
            (block: WorkingBlockDTO) => {
              const startDate = new Date(block.startTime);
              const endDate = new Date(block.endTime);

              const days = [
                'Sunday',
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday',
              ];
              const dayOfWeek = startDate.getDay();
              const day = days[dayOfWeek];

              const formatTime = (date: Date) => {
                return date.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                });
              };

              return {
                day,
                start: formatTime(startDate),
                end: formatTime(endDate),
                source: block.source,
                available: block.availability,
              };
            },
          );

          setCalendarEvents(events);
        } catch (error) {
          console.error('Error fetching working blocks:', error);
          setCalendarEvents([]);
        }
      };

      fetchWorkingBlocks();
      fetchUserCalendarSettings();
    }
  }, [userId, fetchUserCalendarSettings]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const googleConnectStatus = urlParams.get('google_connect');

    if (googleConnectStatus === 'success') {
      setIsConnectedToGoogle(true);
      // Remove query parameter from URL
      const url = new URL(window.location.href);
      url.searchParams.delete('google_connect');
      window.history.replaceState(
        {},
        document.title,
        url.pathname + url.search,
      );

      fetchAvailableCalendars();
    }
  }, [fetchAvailableCalendars]);

  return {
    isConnectedToGoogle,
    calendarEvents,
    selectedCalendarIds,
    availableCalendars,
    isLoadingCalendars,
    isSaving,
    connectGoogleCalendar,
    disconnectGoogleCalendar,
    onCalendarSelectionChange,
    saveSelectedCalendars,
  };
};

export default useCalendar;
