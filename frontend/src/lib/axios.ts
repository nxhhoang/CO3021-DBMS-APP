import axios from 'axios';
import { BASE_URL } from '@/constants/api';

declare global {
  interface Window {
    api: any;
  }
}

export const api = axios.create({
  baseURL: BASE_URL,
});

if (typeof window !== 'undefined') {
  (window as any).api = api;
}

const AUTH_PATHNAMES = [
  '/api/v1/auth/login',
  '/api/v1/auth/register',
  '/api/v1/auth/refresh-token',
];

const GUEST_PAGES = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
];

// Helper kiểm tra route an toàn
const isAuthRequest = (url?: string) => {
  if (!url) return false;
  // Xử lý để lấy ra pathname sạch (loại bỏ domain và query params)
  // Ví dụ: http://localhost:3000/api/v1/auth/login?abc=1 => /api/v1/auth/login
  const path = url.replace(BASE_URL, '').split('?')[0];
  return AUTH_PATHNAMES.some((authPath) => path.endsWith(authPath));
};

api.interceptors.request.use(
  (config) => {
    if (isAuthRequest(config.url)) return config;

    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('accessToken')
        : null;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu không có response (lỗi mạng) hoặc request không tồn tại
    if (!error.response || !originalRequest) return Promise.reject(error);

    // KIỂM TRA CHÍNH XÁC: Nếu là 401 từ trang Login/Register thì DỪNG LUÔN
    if (isAuthRequest(originalRequest.url)) {
      return Promise.reject(error);
    }

    // Chỉ refresh nếu là lỗi 401 và chưa retry
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');

        // Dùng axios instance mới hoàn toàn để không dính interceptor cũ
        const res = await axios.post(`${BASE_URL}/auth/refresh-token`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = res.data.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.clear(); // Xóa sạch để bảo mật

        if (typeof window !== 'undefined') {
          const isAtGuestPage = GUEST_PAGES.some((path) =>
            window.location.pathname.includes(path),
          );
          if (!isAtGuestPage) window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
