import { UserDTO, WorkingBlockDTO, SensorDTO, OfficeDTO } from '@/types';

class ClientApi {
  private async request<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  users = {
    getAll: () => this.request<UserDTO[]>('/api/users'),
    getById: (id: string) => this.request<UserDTO>(`/api/users/${id}`),
    create: (user: Omit<UserDTO, 'id'>) =>
      this.request<{ id: string }>('/api/users', {
        method: 'POST',
        body: JSON.stringify(user),
      }),
    update: (id: string, user: Partial<UserDTO>) =>
      this.request<{ message: string }>(`/api/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(user),
      }),
    delete: (id: string) =>
      this.request<{ message: string }>(`/api/users/${id}`, {
        method: 'DELETE',
      }),
  };

  workingBlocks = {
    getByUserId: (userId: string) =>
      this.request<WorkingBlockDTO[]>(`/api/working-blocks/user/${userId}`),
    create: (workingBlock: Omit<WorkingBlockDTO, 'id'>) =>
      this.request<{ id: string }>('/api/working-blocks', {
        method: 'POST',
        body: JSON.stringify(workingBlock),
      }),
  };

  sensors = {
    getAll: () => this.request<SensorDTO[]>('/api/sensors'),
    getByOfficeId: (officeId: string) =>
      this.request<SensorDTO>(`/api/sensors/byOfficeId?officeId=${officeId}`),
    getByStatus: (isOpen: boolean) =>
      this.request<SensorDTO[]>(`/api/sensors/status?is_open=${isOpen}`),
    create: (sensor: Omit<SensorDTO, 'id' | 'input_time'>) =>
      this.request<{ id: string }>('/api/sensors', {
        method: 'POST',
        body: JSON.stringify(sensor),
      }),
  };

  offices = {
    getAll: () => this.request<OfficeDTO[]>('/api/offices'),
    getById: (id: string) => this.request<OfficeDTO>(`/api/offices/${id}`),
    create: (office: Omit<OfficeDTO, 'id'>) =>
      this.request<{ id: string }>('/api/offices', {
        method: 'POST',
        body: JSON.stringify(office),
      }),
  };
}

export const api = new ClientApi();
