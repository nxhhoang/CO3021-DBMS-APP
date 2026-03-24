'use client';

import { User } from '@/types';
import { userService } from '../../user/services/user.service';
import { authService } from '../services/auth.service';
import { useEffect, useState } from 'react';
import { tokenStorage } from '@/services/tokenStorage';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
  const [user, setUser] = useState<Pick<User, "userId" | "role"> | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  const isAuthenticated = !!user;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = tokenStorage.getAccessToken();
        if (!token) {
          setIsLoading(false);
          return;
        }

        const res = await userService.getProfile();
        setUser(res);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const logout = async () => {
    try {
      const refreshToken = tokenStorage.getRefreshToken();
      if (refreshToken) {
        await authService.logout({ refreshToken });
      }
      else {
        router.push('/login');
        return;
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      tokenStorage.clear();
      setUser(null);
      router.push('/login');
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    logout,
    setUser,
  };
};
