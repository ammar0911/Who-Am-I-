'use client';
import React, { useContext, useRef } from 'react';
import { Search } from '@mui/icons-material';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AppContext } from '@/contexts/AppContext';
import { AvailabilityChip } from '@/components/AvailabilityChip';
import useUsers from '@/hooks/useUsersData';

export default function HomePage() {
  const { t } = useContext(AppContext);
  const { users } = useUsers();
  const router = useRouter();
  const searchInput = useRef<HTMLInputElement>(null);

  // Early return if context is not yet available
  if (!t || !users) {
    return null; // Or a loading state
  }

  const availableUsers = users;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchInput.current) {
      router.push(
        `/search?query=${encodeURIComponent(searchInput.current.value)}`
      );
    }
  };

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-8 relative">
        <div className="mt-15 text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
            {t('homeTitle')}
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-white/90">
            {t('homeTagline')}
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-12 glass rounded-xl p-6">
          <form onSubmit={handleSubmit}>
            <div className="flex justify-center">
              <div className="relative rounded-md shadow-lg w-full max-w-lg">
                <input
                  ref={searchInput}
                  type="text"
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md py-4 bg-white/10 dark:bg-gray-700/10 text-white placeholder-white/70"
                  placeholder={t('searchPlaceholder')}
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70" />
              </div>
              <button
                type="submit"
                className="ml-4 px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg font-medium backdrop-blur-sm transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {t('searchButton')}
              </button>
            </div>
          </form>
        </div>

        <div className="glass rounded-xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            {t('currentlyAvailable')}
          </h2>
          {availableUsers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableUsers.map((user) => (
                <Link
                  key={user.id}
                  href={`/profile/${user.id}`}
                  className="cursor-pointer bg-white/5 backdrop-blur-sm rounded-lg p-6 hover:bg-white/10 transition-all duration-300 border border-white/10"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <Image
                      width={48}
                      height={48}
                      src={user.avatar}
                      alt={user.name}
                      className="w-12 h-12 rounded-full ring-2 ring-white/20"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {user.name}
                      </h3>
                      <p className="text-sm text-white/70">{user.title}</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <AvailabilityChip
                      status={user.available}
                      isPublic={user.isPublic}
                      isLoggedIn={false}
                    />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-white/70">{t('noOneAvailable')}</p>
          )}
        </div>
      </div>
    </div>
  );
}
