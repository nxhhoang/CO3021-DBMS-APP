import axios from 'axios';
import { BASE_URL } from '@/constants/api';

export const api = axios.create({
  baseURL: BASE_URL,
});

if (typeof window !== 'undefined') {
  (window as any).api = api;
}

// 1. Request Interceptor: Tự động thêm Bearer Token vào Header
api.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage (hoặc cookie/state tùy bạn)
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

// 2. Response Interceptor: Xử lý Refresh Token Rotation
api.interceptors.response.use(
  (response) => response, // Trả về dữ liệu nếu request thành công
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi 401 (Unauthorized) và chưa thử refresh lần nào (_retry)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');

        // Gọi API refresh token (đã có handler MSW xử lý)
        const res = await axios.post(`${BASE_URL}/auth/refresh-token`, {
          refreshToken,
        });

        // Theo Specs của bạn: data nằm trong res.data.data
        const { accessToken, refreshToken: newRefreshToken } = res.data.data;

        // Lưu cặp token mới vào máy khách
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        // Cập nhật lại header cho request cũ và thực hiện lại
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Nếu refresh cũng lỗi (hết hạn hoàn toàn) -> Xóa sạch và logout
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
