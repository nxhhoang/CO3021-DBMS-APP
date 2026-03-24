"use client";

import { UpdateProfileRequest } from '@/types';
import { userService } from '../services/user.service';
import { getErrorMessage } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { User } from '@/types';

export const useProfile = () => {
  const [profile, setProfile] = useState<User | null>(null);

  useEffect(() => {
    getProfile()
      .then(setProfile)
      .catch((error) => {
        console.error('Error fetching profile:', error);
      });
  }, []);

  const getProfile = async () => {
    try {
      const res = await userService.getProfile();
      setProfile(res);
      return res;
    } catch (error) {
      const errorMessage = getErrorMessage(
        error,
        'Failed to fetch user profile',
      );
      alert(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateProfile = async (data: UpdateProfileRequest) => {
    try {
      await userService.updateProfile(data);
      const res = await getProfile();
      setProfile((prev) => ({
        ...prev,
        ...res,
      } as User));
      return res;
    } catch (error) {
      const errorMessage = getErrorMessage(
        error,
        'Failed to update user profile',
      );
      throw new Error(errorMessage);
    }
  };



  return { profile, getProfile, updateProfile };
};
