'use client';
import { authService } from '../services/auth.service';
import type { RegisterRequest } from '@/types';
import { getErrorMessage } from '@/lib/utils';

export const useRegister = () => {

  const register = async (payload: RegisterRequest) => {
    try{
    return await authService.register(payload);
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, 'Registration failed'));
    }
  };

  return {
    register,
  };
};
