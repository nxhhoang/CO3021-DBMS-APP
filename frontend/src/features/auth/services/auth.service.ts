import { api, privateApi } from '@/lib/axios';
import {
  LoginRequest,
  RegisterRequest,
  LogoutRequest,
  RegisterResponse,
  LoginResponse,
  RefreshTokenResponse,
} from '@/types/auth.types';

export const authService = {
  async login(payload: LoginRequest) {
    const { data } = await api.post<LoginResponse>(`auth/login`, payload);
    return data.data;
  },

  async register(payload: RegisterRequest) {
    const { data } = await api.post<RegisterResponse>(`auth/register`, payload);
    return data.data;
  },

  async refresh(payload: { refreshToken: string }) {
    const { data } = await api.post<RefreshTokenResponse>(`auth/refresh-token`, payload);
    return data.data;
  },

  async logout(payload: LogoutRequest) {
    return privateApi.post(`auth/logout`, payload);
  },
};

// api.post('auth/login', { email: 'customer@example.com', password: '123' });
// api.post('auth/register', { fullName: 'New User', email: 'newuser@example.com', phoneNum: '0922222222', password: '123' });
// api.post('auth/refresh-token', { refreshToken: 'refresh-token-customer' });
// privateApi.post('auth/logout', { refreshToken: 'refresh-token-customer' });
