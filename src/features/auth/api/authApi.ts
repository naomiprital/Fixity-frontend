import axios from 'axios';
import { publicApi } from '@/shared/api/axiosInstance';

export type AuthUser = {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  cityId: number | null;
  cityName: string | null;
};

export type AuthResponse = {
  message: string;
  token: string;
  refreshToken: string;
  user: AuthUser;
};

export type SignInPayload = {
  email: string;
  password: string;
};

export type SignUpPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  cityId: number;
};

async function postJson<TResponse>(path: string, body: object): Promise<TResponse> {
  try {
    const { data } = await publicApi.post<TResponse>(path, body);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const serverError = error.response?.data as { error?: string; message?: string } | undefined;
      throw new Error(serverError?.error || serverError?.message || error.message);
    }
    throw error;
  }
}

export function signIn(payload: SignInPayload) {
  return postJson<AuthResponse>('/auth/signin', payload);
}

export function signUp(payload: SignUpPayload) {
  return postJson<AuthResponse>('/auth/signup', payload);
}
