import axios, { type AxiosError, AxiosHeaders, type InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_SERVER_BASE_URL || (window.location.origin + '/api');
const AUTH_STORAGE_KEY = 'fixity.auth';

export enum Paths {
  AUTH = '/auth',
  CITIES = '/cities',
  REPORT_CATEGORIES = '/report-categories',
  REPORTS = '/reports',
  MANAGER = '/manager',
  INCIDENTS = '/incidents',
  TASKS = '/tasks',
  CATEGORIES = '/categories',
  STAFF = '/staff',
}
const REFRESH_PATH = `${Paths.AUTH}/refresh`;

export type StoredAuthData = {
  token: string;
  refreshToken: string;
  [key: string]: unknown;
};

function getStoredAuth(): StoredAuthData | null {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as StoredAuthData;
  } catch {
    return null;
  }
}

function setStoredAuth(authData: StoredAuthData): void {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
}

function clearStoredAuth(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export const publicApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const authApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

authApi.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const authData = getStoredAuth();
  if (authData?.token) {
    const headers = AxiosHeaders.from(config.headers ?? {});
    headers.set('Authorization', `Bearer ${authData.token}`);
    config.headers = headers;
  }
  return config;
});

interface RetryableRequest extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (error: unknown) => void;
  config: RetryableRequest;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      if (token) {
        const headers = AxiosHeaders.from(promise.config.headers ?? {});
        headers.set('Authorization', `Bearer ${token}`);
        promise.config.headers = headers;
      }
      promise.resolve(authApi(promise.config));
    }
  });
  failedQueue = [];
};

const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

authApi.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequest | undefined;
    if (!originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    const authData = getStoredAuth();
    if (!authData?.refreshToken) {
      clearStoredAuth();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject, config: originalRequest });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { data } = await refreshClient.post<StoredAuthData>(REFRESH_PATH, {
        refreshToken: authData.refreshToken,
      });

      const updatedAuth = {
        ...authData,
        token: data.token,
        refreshToken: data.refreshToken ?? authData.refreshToken,
      };

      setStoredAuth(updatedAuth);
      authApi.defaults.headers.common.Authorization = `Bearer ${updatedAuth.token}`;
      processQueue(null, updatedAuth.token);

      const updatedHeaders = AxiosHeaders.from(originalRequest.headers ?? {});
      updatedHeaders.set('Authorization', `Bearer ${updatedAuth.token}`);
      originalRequest.headers = updatedHeaders;

      return authApi(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      clearStoredAuth();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
