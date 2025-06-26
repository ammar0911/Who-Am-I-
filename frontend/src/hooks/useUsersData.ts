import { UserDTO } from '@/types';
import { useEffect, useState } from 'react';
import { api } from '@/lib/apiClient';

export default function useUsers() {
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const userData = await api.users.getAll();
      setUsers(userData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  return { users, loading, error };
}
