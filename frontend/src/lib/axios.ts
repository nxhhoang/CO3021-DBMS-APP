import axios from 'axios';
import { BASE_URL } from '@/constants/api';

declare global {
  interface Window {
    api: typeof api;
    privateApi: typeof privateApi;
  }
}

export const api = axios.create({
  baseURL: BASE_URL,
});

export const privateApi = axios.create({
  baseURL: BASE_URL,
});

// Thêm interceptor để tự động đính kèm token vào header của privateApi
privateApi.interceptors.request.use(
  (config) => {
    const token =
      typeof window !== 'undefined'
        ? window.localStorage.getItem('accessToken')
        : null;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Để tiện sử dụng trong các file khác mà không cần import lại
if (typeof window !== 'undefined') {
  window.api = api;
  window.privateApi = privateApi;
}

// privateApi.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       const res = await api.post('auth/refresh-token');

//       const newAccessToken = res.data.data.accessToken;

//       localStorage.setItem('accessToken', newAccessToken);

//       originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

//       return privateApi(originalRequest);
//     }

//     return Promise.reject(error);
//   },
// );
