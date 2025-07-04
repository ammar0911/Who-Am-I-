import React, { useContext } from 'react';

import { AppContext } from '@/contexts/AppContext';
import { AccountType, AvailabilityStatus, UserDTO } from '@/types';

import { AvailabilityChip } from '../AvailabilityChip';

interface ExpectedUser extends Omit<UserDTO, 'available' | 'accountType'> {
  available: keyof typeof AvailabilityStatus | undefined;
  accountType: keyof typeof AccountType | undefined;
}
interface UserDataCardProps {
  user: Partial<ExpectedUser>;
}

const UserDataCard: React.FC<UserDataCardProps> = ({ user }) => {
  const { t } = useContext(AppContext);

  console.log({ user });

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 text-center">
      <img
        width={64}
        height={64}
        src={user.avatar || '/images/default-avatar.png'}
        className="h-24 w-24 rounded-full mb-4 mx-auto"
        alt=""
        aria-hidden
      />
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {user.name}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">{user.title}</p>
        <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
          {user.officeId}
        </p>
      </div>

      <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
          {t('currentStatus')}
        </h3>
        <div className="flex justify-center">
          <AvailabilityChip
            status={AvailabilityStatus.Available}
            isPublic={Boolean(user.isPublic)}
            isLoggedIn={true}
          />
        </div>
      </div>
    </div>
  );
};

export default UserDataCard;
