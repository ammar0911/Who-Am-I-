import { SensorDTO } from '@/types';
import { useEffect, useState } from 'react';
import { api } from '@/lib/apiClient';

export default function useSensorsData() {
  const [sensors, setSensors] = useState<SensorDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSensors();
  }, []);

  const fetchSensors = async () => {
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

export function useSensorsByOfficeId(officeId: string) {
  const [sensors, setSensors] = useState<SensorDTO>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (officeId) {
      fetchSensorsByOfficeId(officeId);
    }
  }, [officeId]);

  const fetchSensorsByOfficeId = async (officeId: string) => {
    try {
      setLoading(true);
      const sensorsData = await api.sensors.getByOfficeId(officeId);
      setSensors(sensorsData);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to fetch sensors by office ID'
      );
    } finally {
      setLoading(false);
    }
  };

  return { sensors, loading, error };
}
