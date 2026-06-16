import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi, Paths } from '@/shared/api/axiosInstance';

export interface StaffUser {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  role: 'Manager' | 'Worker' | 'Citizen' | 'Official' | 'HR';
  profilePictureUrl: string | null;
  createdAt: string;
}

export interface CreateStaffPayload {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export async function fetchStaff(role: 'Manager' | 'Worker' | 'Official' | 'HR'): Promise<StaffUser[]> {
  const { data } = await authApi.get<StaffUser[]>(`${Paths.STAFF}?role=${role}`);
  return data;
}

export async function createStaff(payload: CreateStaffPayload): Promise<StaffUser> {
  const { data } = await authApi.post<{ message: string; user: StaffUser }>(Paths.STAFF, payload);
  return data.user;
}

export const useStaffList = (role: 'Manager' | 'Worker' | 'Official' | 'HR') => {
  return useQuery<StaffUser[]>({
    queryKey: ['staff-list', role],
    queryFn: () => fetchStaff(role),
  });
};

export const useCreateStaff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createStaff,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-list'] });
    },
  });
};

export async function deleteStaff(userId: number): Promise<void> {
  await authApi.delete(`${Paths.STAFF}/${userId}`);
}

export const useDeleteStaff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteStaff,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-list'] });
    },
  });
};
