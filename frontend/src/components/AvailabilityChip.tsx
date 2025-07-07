'use client';
import React, { useContext } from 'react';
import { CheckCircle, Cancel, AccessTime } from '@mui/icons-material';
import { AppContext } from '../contexts/AppContext';
import { AvailabilityStatus } from '@/hooks/api/requests';

const availabilityColors: Record<AvailabilityStatus, string> = {
  Available:
    'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  NotAvailable: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
  Private: 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
};

const availabilityIcons: Record<AvailabilityStatus, React.ReactElement> = {
  Available: (
    <CheckCircle className="w-4 h-4 mr-2 text-green-600 dark:text-green-400" />
  ),
  NotAvailable: (
    <Cancel className="w-4 h-4 mr-2 text-red-600 dark:text-red-400" />
  ),
  Private: (
    <AccessTime className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
  ),
};

export interface AvailabilityChipProps {
  status: AvailabilityStatus;
  isPublic: boolean;
  isLoggedIn: boolean;
}

export const AvailabilityChip: React.FC<AvailabilityChipProps> = ({
  status,
  isPublic,
  isLoggedIn,
}) => {
  const { t } = useContext(AppContext);

  const displayStatus = isPublic || isLoggedIn ? status : 'Private';

  const getLocalizedStatus = (status: AvailabilityStatus) => {
    switch (status) {
      case 'Available':
        return t('available');
      case 'NotAvailable':
        return t('notAvailable');
      case 'Private':
        return t('availabilityPrivate');
      default:
        return status;
    }
  };
  const localizedStatus = getLocalizedStatus(
    displayStatus as AvailabilityStatus,
  );
  const color = availabilityColors[displayStatus as AvailabilityStatus];
  const icon = availabilityIcons[displayStatus as AvailabilityStatus];

  return (
    <div
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${color}`}
    >
      {icon}
      {localizedStatus}
    </div>
  );
};
