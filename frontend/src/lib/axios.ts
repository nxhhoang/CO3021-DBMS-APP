import axios, {
  AxiosError,
  AxiosHeaders,
  InternalAxiosRequestConfig,
} from 'axios';
import { BASE_URL } from '@/constants/api';
import { tokenStorage } from '@/services/tokenStorage';

declare global {
  interface Window {
    api: typeof api;
    privateApi: typeof privateApi;
  }
}

interface AxiosRequestConfigWithRetry extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const api = axios.create({
  baseURL: BASE_URL,
});

export const privateApi = axios.create({
  baseURL: BASE_URL,
});

let refreshPromise: Promise<string> | null = null;

// Thêm interceptor để tự động đính kèm token vào header của privateApi
privateApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token =
      typeof window !== 'undefined' ? tokenStorage.getAccessToken() : null;
    if (token) {
      config.headers = new AxiosHeaders(config.headers);
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

privateApi.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | AxiosRequestConfigWithRetry
      | undefined;

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    try {
      if (!refreshPromise) {
        refreshPromise = api
          .post('auth/refresh-token')
          .then((res) => {
            const newAccessToken = res.data.data.accessToken;
            tokenStorage.setAccessToken(newAccessToken);

            privateApi.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;

            return newAccessToken;
          })
          .catch((refreshError) => {
            console.error('Error refreshing token:', refreshError);
            tokenStorage.clear();
            window.location.href = '/login';
            throw refreshError;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      const newAccessToken = await refreshPromise;

      originalRequest.headers = new AxiosHeaders(originalRequest.headers);
      originalRequest.headers.set('Authorization', `Bearer ${newAccessToken}`);

      return privateApi(originalRequest);
    } catch (refreshError) {
      console.error('Error refreshing token:', refreshError);
      tokenStorage.clear();
      window.location.href = '/login';
      return Promise.reject(refreshError);
    }
  },
);
