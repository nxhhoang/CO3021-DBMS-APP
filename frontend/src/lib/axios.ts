import axios from 'axios';
import { BASE_URL } from '@/constants/api';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const privateApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor cho private API
privateApi.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken')
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error)
  }
);

// Khai báo kiểu dữ liệu cho window (nếu dùng TypeScript)
declare global {
  interface Window {
    api: typeof api;
    privateApi: typeof privateApi;
  }
}

// Gán vào window để debug khi cần thiết
if (typeof window !== 'undefined') {
  window.api = api
  window.privateApi = privateApi
}