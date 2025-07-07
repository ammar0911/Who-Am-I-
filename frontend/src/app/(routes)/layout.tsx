import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/contexts/AppContext';
import { Header } from '@/components/Header';
import { PageContent } from '@/components/PageContent';

export const metadata: Metadata = {
  title: 'No-Knock',
  description:
    'The smart directory for real-time, calendar-integrated, and predicted availability.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppProvider>
      <Header />
      <PageContent>{children}</PageContent>
    </AppProvider>
  );
}
