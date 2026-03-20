'use client';
import { authService } from '../services/auth.service';
import type { RegisterRequest, RegisterResponse } from '@/types';

export const useRegister = () => {

  const register = async (payload: RegisterRequest) => {
    try{
    return await authService.register(payload);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Register failed';
      throw new Error(message);
    }
  };

  return {
    register,
  };
};
