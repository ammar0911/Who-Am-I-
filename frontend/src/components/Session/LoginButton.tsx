'use client';
import { Login as LoginIcon } from '@mui/icons-material';
import { signIn } from 'next-auth/react';

const LoginButton: React.FC = () => {
  return (
    <div className="hidden md:block">
      <button
        className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium py-2 px-4 rounded-lg flex items-center cursor-pointer hover:text-indigo-600 transition-colors duration-200"
        onClick={() => signIn()}
      >
        <LoginIcon className="w-5 h-5 mr-2" /> Login
      </button>
    </div>
  );
};

export default LoginButton;
