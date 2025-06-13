import Head from 'next/head';
import { Geist, Geist_Mono } from 'next/font/google';
import useUsersData from '@/hooks/useUsersData';
import useSensorsData, { useSensorsByOfficeId } from '@/hooks/useSensorsData';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function Home() {
  const { users, loading, error } = useUsersData();
  const {
    sensors,
    loading: sensorsLoading,
    error: sensorsError,
  } = useSensorsData();

  const {
    sensors: officeSensors,
    loading: officeSensorsLoading,
    error: officeSensorsError,
  } = useSensorsByOfficeId(users[0]?.officeId || '');

  return (
    <>
      <Head>
        <title>Sensors and Users data</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={`${geistSans.variable} ${geistMono.variable}`}>
        <main>
          <h2 className="text-2xl font-bold">Users List</h2>
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          <ul>
            {users.map((user) => (
              <li key={user.id} className="py-2">
                <strong>{user.name}</strong> - {user.email}
              </li>
            ))}
          </ul>
          <h2 className="text-2xl font-bold mt-8">Sensors List</h2>
          {sensorsLoading && <p>Loading sensors...</p>}
          {sensorsError && <p className="text-red-500">{sensorsError}</p>}
          <ul>
            {sensors.map((sensor) => (
              <li key={sensor.id} className="py-2">
                <strong>{sensor.id}</strong> - 🔋{sensor.batteryStatus}% -{' '}
                {sensor.isOpen ? 'Open' : 'Closed'} -{' '}
                {new Date(sensor.inputTime).toLocaleString()}
              </li>
            ))}
          </ul>
          <h2 className="text-2xl font-bold mt-8">
            Sensors by Office ID: {users[0]?.officeId}
          </h2>
          {officeSensorsLoading && <p>Loading office sensors...</p>}
          {officeSensorsError && (
            <p className="text-red-500">{officeSensorsError}</p>
          )}
          <ul>
            {officeSensors && (
              <li className="py-2">
                <strong>{officeSensors.id}</strong> - 🔋
                {officeSensors.batteryStatus}% -{' '}
                {officeSensors.isOpen ? 'Open' : 'Closed'} -{' '}
                {new Date(officeSensors.inputTime).toLocaleString()}
              </li>
            )}
          </ul>
        </main>
        <footer></footer>
      </div>
    </>
  );
}
