import { api } from '@/lib/axios';

export interface LoginPayload {
  email: string;
  password: string;
  userAgent: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  fullName: string;
  phoneNum: string;
}

export const authService = {
  async login(payload: LoginPayload) {
    const res = await api.post(`auth/login`, payload);
    return res.data;
  },

  async register(payload: RegisterPayload) {
    const res = await api.post(`auth/register`, payload);
    return res.data;
  },

  async refresh() {
    const res = await api.post(`auth/refresh`);
    return res.data;
  },

  async logout() {
    const res = await api.post(`auth/logout`);
    return res.data;
  },
};
