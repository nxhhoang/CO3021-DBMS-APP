import { api, privateApi } from '@/lib/axios';
import { LoginRequest, RegisterRequest, LogoutRequest } from '@/types';

export const authService = {
  async login(payload: LoginRequest) {
    // Trả về toàn bộ response.data từ axios
    const res = await api.post(`auth/login`, payload)
    return res.data
  },

  async register(payload: RegisterRequest) {
    const res = await api.post(`auth/register`, payload);
    return res.data;
  },

  async refresh() {
    const res = await api.post(`auth/refresh-token`);
    return res.data;
  },

  async logout({ refreshToken }: LogoutRequest) {
    return privateApi.post(`auth/logout`, {
      refreshToken,
    });
  },
};

// api.post('auth/login', { email: 'customer@example.com', password: '123' });
// api.post('auth/register', { fullName: 'New User', email: 'newuser@example.com', phoneNum: '0922222222', password: '123' });
// api.post('auth/refresh-token', { refreshToken: 'refresh-token-customer' });
// privateApi.post('auth/logout', { refreshToken: 'refresh-token-customer' });
