'use client';

import { AccessTime } from '@mui/icons-material';
import LoginIcon from '@mui/icons-material/Login';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useContext } from 'react';

import UserDataCard from '@/components/Profile/UserDataCard';
import UserSettings from '@/components/Profile/UserSettings';
import { WeeklyAvailabilityView } from '@/components/WeeklyAvailabilityView';
import { AppContext } from '@/contexts/AppContext';
import useCalendar from '@/hooks/useCalendar';
import { useUsersServiceGetApiUsersById } from '@/hooks/api/queries';

export default function ProfilePage() {
  const { t } = useContext(AppContext);
  const params = useParams();
  const { data: session, status: sessionLoadingStatus } = useSession();
  const userId = (params?.userId as string) || null;

  const {
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
  } = useCalendar(userId);

  const {
    data: user,
    isFetching: isUserFetching,
    isLoading: isUserLoading,
  } = useUsersServiceGetApiUsersById(
    {
      id: userId || '',
    },
    [`user/${userId}`],
    {
      enabled: !!userId,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
    },
  );

  if (
    !t ||
    sessionLoadingStatus === 'loading' ||
    isUserLoading ||
    isUserFetching
  ) {
    return (
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 flex justify-center">
        <span className="loading loading-spinner loading-xl my-10 scale-150" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center p-10 dark:text-gray-200">
        {t('profileNotFound')}
        <Link href="/" className="text-indigo-600 hover:underline">
          {t('goHome')}
        </Link>
      </div>
    );
  }

  const currentUser = session?.user;

  const isCurrentUserProfile = userId === currentUser?.id;

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          {/* User profile card */}
          <UserDataCard user={user} />

          {isCurrentUserProfile && (
            <UserSettings
              isConnectedToGoogle={isConnectedToGoogle}
              selectedCalendarIds={selectedCalendarIds}
              availableCalendars={availableCalendars}
              isLoadingCalendars={isLoadingCalendars}
              isSaving={isSaving}
              connectGoogleCalendar={connectGoogleCalendar}
              disconnectGoogleCalendar={disconnectGoogleCalendar}
              onCalendarSelectionChange={onCalendarSelectionChange}
              saveSelectedCalendars={saveSelectedCalendars}
            />
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          {true ? (
            <WeeklyAvailabilityView
              predictedAvailability={{}}
              calendarEvents={calendarEvents}
            />
          ) : (
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 text-center">
              <AccessTime className="w-12 h-12 mx-auto text-gray-400" />
              <h3 className="mt-4 text-xl font-semibold text-gray-800 dark:text-gray-100">
                {t('availabilityPrivate')}
              </h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                {t('availabilityPrivateDesc', {
                  name: user?.name?.split(' ')[0] || '',
                })}
              </p>
              <Link
                href="/login"
                className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <LoginIcon className="w-4 h-4 mr-2" /> {t('loginToView')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
