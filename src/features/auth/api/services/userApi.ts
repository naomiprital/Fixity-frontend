import { api } from './axiosInstance';
import type { AuthUser } from '../authApi';

const USER_ROUTE = 'user';

export const updateUserProfile = async (payload: {
  firstName?: string;
  lastName?: string;
  cityId?: number;
}): Promise<{ message: string; user: AuthUser }> => {
  const { data } = await api.patch(`${USER_ROUTE}/me`, payload);
  return data;
};

export const uploadAvatar = async (file: File): Promise<{ message: string; user: AuthUser }> => {
  const formData = new FormData();
  formData.append('avatar', file);
  const { data } = await api.post(`${USER_ROUTE}/me/avatar`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};
