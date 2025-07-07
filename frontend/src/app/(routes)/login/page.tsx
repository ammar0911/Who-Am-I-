'use client';
import React, { useContext } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

import { AppContext } from '@/contexts/AppContext';

export default function LoginPage() {
  const { t } = useContext(AppContext);
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        Signed in as {session.userDTO?.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
          {t('loginTitle')}
        </h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
            {t('chooseUser')}
          </p>
          <div className="space-y-4">
            <button onClick={() => signIn()}>Sign in</button>
          </div>
        </div>
      </div>
    </div>
  );
}
