import { CalendarMonth, Settings } from '@mui/icons-material';
import { Button, Switch } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useContext } from 'react';

import CalendarSelection from '@/components/CalendarSelection';
import { AppContext } from '@/contexts/AppContext';

interface UserSettingsProps {
  isConnectedToGoogle: boolean;
  availableCalendars: Array<{ id: string; summary: string }>;
  selectedCalendarIds: string[];
  isLoadingCalendars: boolean;
  isSaving: boolean;
  connectGoogleCalendar: () => void;
  disconnectGoogleCalendar: () => void;
  onCalendarSelectionChange: (selectedIds: string[]) => void;
  saveSelectedCalendars: () => void;
}

const UserSettings: React.FC<UserSettingsProps> = ({
  isConnectedToGoogle,
  availableCalendars,
  selectedCalendarIds,
  isLoadingCalendars,
  isSaving,
  connectGoogleCalendar,
  disconnectGoogleCalendar,
  onCalendarSelectionChange,
  saveSelectedCalendars,
}) => {
  const { t } = useContext(AppContext);
  const { data: session } = useSession();
  const user = session?.user;

  const calendarSelectionUI = (
    <div className="mt-4 p-4 border rounded-lg dark:border-gray-700">
      <h4 className="font-medium text-gray-700 dark:text-gray-200 mb-2">
        Select Calendars
      </h4>
      {isLoadingCalendars ? (
        <p className="text-sm text-gray-500">Loading calendars...</p>
      ) : (
        <>
          <CalendarSelection
            availableCalendars={availableCalendars}
            selectedCalendarIds={selectedCalendarIds}
            onCalendarSelectionChange={onCalendarSelectionChange}
          />
          <Button
            variant="contained"
            color="primary"
            className="mt-3"
            fullWidth
            disabled={isSaving}
            onClick={saveSelectedCalendars}
          >
            {isSaving ? 'Saving...' : 'Save Calendar Selection'}
          </Button>
        </>
      )}
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
        <Settings className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
        {t('profileSettings')}
      </h3>
      <div className="space-y-4">
        {/* Public availability toggle */}
        <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
          <div>
            <p className="font-medium text-gray-700 dark:text-gray-200">
              {t('publicAvailability')}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('publicAvailabilityDesc')}
            </p>
          </div>
          <Switch
            checked={user?.isPublic}
            onChange={
              () => {}
              // updateUserVisibility(String(user.id), e.target.checked)
            }
          />
        </div>

        {/* Google Calendar integration */}
        {isConnectedToGoogle ? (
          <>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<CalendarMonth />}
              onClick={disconnectGoogleCalendar}
            >
              Disconnect Google Calendar
            </Button>
            {calendarSelectionUI}
          </>
        ) : (
          <Button
            variant="outlined"
            fullWidth
            startIcon={<CalendarMonth />}
            onClick={connectGoogleCalendar}
          >
            {t('connectGoogle')}
          </Button>
        )}
      </div>
    </div>
  );
};

export default UserSettings;
