'use client';
import AccountButton from './AccountButton';
import LoginButton from './LoginButton';
import { useSession } from 'next-auth/react';

const SessionSwitch: React.FC = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return null;
  }

  return session ? <AccountButton /> : <LoginButton />;
};

export default SessionSwitch;
