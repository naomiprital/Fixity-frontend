const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api';

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
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = (await response.json().catch(() => null)) as { error?: string } | null;

  if (!response.ok) {
    throw new Error(data?.error || 'Request failed');
  }

  return data as TResponse;
}

export function signIn(payload: SignInPayload) {
  return postJson<AuthResponse>('/auth/signin', payload);
}

export function signUp(payload: SignUpPayload) {
  return postJson<AuthResponse>('/auth/signup', payload);
}
