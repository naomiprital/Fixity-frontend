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
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api';

export async function getCities(
  page: number = 1,
  limit: number = 10,
  filter?: string,
  signal?: AbortSignal
): Promise<CitiesResponse> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (filter) {
    params.set('filter', filter);
  }

  const response = await fetch(`${API_BASE_URL}/cities?${params.toString()}`, {
    method: 'GET',
    signal,
  });

  const data = (await response.json().catch(() => null)) as
    | CitiesResponse
    | { error?: string }
    | null;

  if (!response.ok) {
    const errorMessage = data && 'error' in data ? data.error : 'Failed to load cities';
    throw new Error(errorMessage);
  }

  return data as CitiesResponse;
}
