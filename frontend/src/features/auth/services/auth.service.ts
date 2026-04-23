import { api, privateApi } from '@/lib/axios';
import { LoginRequest, RegisterRequest, LogoutRequest } from '@/types';

export const authService = {
  async login(payload: LoginRequest) {
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
