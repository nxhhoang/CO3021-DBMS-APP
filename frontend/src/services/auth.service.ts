import { api } from '@/lib/axios';

export async function login(data: {
  email: string;
  password: string;
  userAgent: string;
}) {
  const res = await api.post('/auth/login', data);
  return res.data;
}
