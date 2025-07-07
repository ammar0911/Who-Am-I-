'use client';
import { signOut } from 'next-auth/react';
import { Logout as LogoutIcon } from '@mui/icons-material';

const LogoutButton: React.FC = () => {
  return (
    <button
      className="ml-1 text-gray-600 dark:text-gray-300 hover:text-indigo-600 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
      onClick={() => signOut()}
    >
      <LogoutIcon />
    </button>
  );
};
export default LogoutButton;
