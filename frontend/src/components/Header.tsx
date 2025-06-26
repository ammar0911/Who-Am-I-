'use client';
import React, { useContext } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Login as LoginIcon, Logout as LogoutIcon } from '@mui/icons-material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { AppContext } from '../contexts/AppContext';
import { LanguageSwitcher } from './LanguageSwitcher';

export const Header: React.FC = () => {
  const { currentUser, logout, mode, toggleTheme, t } = useContext(AppContext);
  const router = useRouter();
  const [mounted, setMounted] = React.useState(false);

  // After mounting, we have access to the theme
  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/home" className="flex-shrink-0 cursor-pointer">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              No-<span className="text-indigo-500">Knock</span>
            </h1>
          </Link>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-1">
              <Link
                href="/home"
                className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                {t('home')}
              </Link>
              <Link
                href="/search"
                className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                {t('directory')}
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <LanguageSwitcher />
            <button
              onClick={toggleTheme}
              className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {mounted &&
                (mode === 'dark' ? (
                  <LightModeIcon className="w-5 h-5" />
                ) : (
                  <DarkModeIcon className="w-5 h-5" />
                ))}
            </button>
            {currentUser ? (
              <div className="relative flex items-center">
                <Link
                  href={`/profile/${currentUser.id}`}
                  className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Image
                    className="h-8 w-8 rounded-full"
                    src={currentUser.avatar}
                    alt="User avatar"
                    width={32}
                    height={32}
                  />
                  <span className="text-gray-700 dark:text-gray-200 font-medium hidden sm:inline">
                    {currentUser.name}
                  </span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    router.push('/home');
                  }}
                  className="ml-1 text-gray-600 dark:text-gray-300 hover:text-indigo-600 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <LogoutIcon />
                </button>
              </div>
            ) : (
              <div className="hidden md:block">
                <Link
                  href="/login"
                  className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium py-2 px-4 rounded-lg flex items-center"
                >
                  <LoginIcon className="w-5 h-5 mr-2" /> {t('login')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};
