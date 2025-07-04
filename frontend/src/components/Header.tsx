'use client';
import React, { useContext } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { AppContext } from '../contexts/AppContext';
import LanguageSwitcher from './LanguageSwitcher';
import SessionSwitch from './Session/SessionSwitch';
import { AccountType } from '@/types';

export const Header: React.FC = () => {
  const { mode, toggleTheme, t } = useContext(AppContext);
  const { data: session } = useSession();
  const [mounted, setMounted] = React.useState(false);

  const isAdmin = session?.user?.accountType === AccountType.Admin;

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
              {isAdmin && (
                <Link
                  href="/admin"
                  className="flex items-center text-indigo-600 dark:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Admin Panel
                </Link>
              )}
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
            <SessionSwitch />
          </div>
        </div>
      </nav>
    </header>
  );
};
