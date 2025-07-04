'use client';
import Link from 'next/link';
import LogoutButton from './LogoutButton';
import { useSession } from 'next-auth/react';

const AccountButton: React.FC = () => {
  const { data: session } = useSession();

  if (!session) {
    return null;
  }

  return (
    <div className="relative flex items-center">
      <Link
        href={`/profile/${session.user?.id}`}
        className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <img
          className="h-8 w-8 rounded-full"
          src={session.user?.image || ''}
          alt="User avatar"
          width={32}
          height={32}
        />
        <span className="text-gray-700 dark:text-gray-200 font-medium hidden sm:inline">
          {session.user?.name}
        </span>
      </Link>
      <LogoutButton />
    </div>
  );
};

export default AccountButton;
