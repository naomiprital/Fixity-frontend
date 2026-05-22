import { authApi, Paths } from '@/shared/api/axiosInstance';
import { type Task } from '../types';

export const workerApi = {
  claimTask: async (taskId: number): Promise<Task> => {
    const response = await authApi.patch(`${Paths.TASKS}/${taskId}/assign`);
    return response.data;
  },

  uploadImage: async (taskId: number, file: File): Promise<{ imageUrl: string }> => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await authApi.post(`${Paths.TASKS}/${taskId}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  resolveTask: async (taskId: number, cityResponse: string): Promise<Task> => {
    const response = await authApi.patch(`${Paths.TASKS}/${taskId}/status`, {
      status: 'closed',
      cityResponse,
    });
    return response.data;
  },

  getTasks: async (): Promise<Task[]> => {
    const response = await authApi.get(`${Paths.TASKS}`);
    return response.data;
  },
};
