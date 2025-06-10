import Head from 'next/head';
import { Geist, Geist_Mono } from 'next/font/google';
import useUsers from '@/hooks/useUsers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function Home() {
  const { users, loading, error } = useUsers();

  return (
    <>
      <Head>
        <title>Sensors and Users data</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={`${geistSans.variable} ${geistMono.variable}`}>
        <main>
          <h1 className="text-2xl font-bold">Users List</h1>
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          <ul>
            {users.map((user) => (
              <li key={user.id} className="py-2">
                <strong>{user.name}</strong> - {user.email}
              </li>
            ))}
          </ul>
        </main>
        <footer></footer>
      </div>
    </>
  );
}
