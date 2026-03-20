'use client';

import { authService } from '../services/auth.service';
import { LoginRequest } from '../../../types/auth.types';
import { tokenStorage } from '@/services/tokenStorage';
import { useAuthContext } from '../context/AuthProvider';

export const useLogin = () => {
  const { setUser } = useAuthContext();

  const login = async (data: Omit<LoginRequest, 'userAgent'>) => {
    try {
      const result = await authService.login({
        ...data,
        userAgent: navigator.userAgent,
      });

      if (result === null) {
        throw new Error('Login failed');
      }
      const { accessToken, refreshToken } = result;

      setUser(result.user);

      tokenStorage.setAccessToken(accessToken);
      tokenStorage.setRefreshToken(refreshToken);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Invalid email or password';
      throw new Error(message);
    }
  };

  return {
    login,
  };
};
