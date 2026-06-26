import axios from 'axios';
import { publicApi, Paths } from '@/shared/api/axiosInstance';

export type City = {
  cityId: number;
  name: string;
};

export type CitiesResponse = {
  items: City[];
  total: number;
  page: number;
  limit: number;
};

export async function getCities(
  page: number = 1,
  limit: number = 10,
  filter?: string,
  signal?: AbortSignal
): Promise<CitiesResponse> {
  const params: Record<string, string> = {
    page: String(page),
    limit: String(limit),
  };

  if (filter) {
    params.filter = filter;
  }

  try {
    const { data } = await publicApi.get<CitiesResponse>(`${Paths.CITIES}`, {
      params,
      signal,
    });
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const serverError = error.response?.data as { error?: string; message?: string } | undefined;
      throw new Error(serverError?.error || serverError?.message || error.message);
    }
    throw error;
  }
}
