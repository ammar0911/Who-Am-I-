import { SensorDTO } from '@/types';
import { useEffect, useState } from 'react';
import { api } from '@/lib/apiClient';

export default function useSensorsData() {
  const [sensors, setSensors] = useState<SensorDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const sensorsData = await api.sensors.getAll();
      setSensors(sensorsData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch sensors');
    } finally {
      setLoading(false);
    }
  };

  return { sensors, loading, error };
}
