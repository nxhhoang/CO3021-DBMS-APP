import { api, privateApi } from '../lib/axios';
import { GetProfileResponse, UpdateProfileRequest } from '@/types';

export const userService = {
  async getProfile() {
    const res = await privateApi.get<GetProfileResponse>(`users/profile`);
    return res.data;
  },

  async updateProfile(data: UpdateProfileRequest) {
    const res = await privateApi.put(`users/profile`, data);
    return res.data;
  },
};

// Example for getProfile in console:
// privateApi.get('users/profile').then(res => console.log(res.data));
