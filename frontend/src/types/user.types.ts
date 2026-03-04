import { ApiResponse } from './api.types';
import { ROLE } from '@/constants/enum';

export interface User {
  userId: string;
  fullName: string;
  email: string;
  phoneNum: string;
  avatar?: string;
  role: keyof typeof ROLE;
}

//GET /users/profile
export type GetProfileRequest = void;
export type GetProfileResponse = ApiResponse<Omit<User, 'role'>>;

//PUT /users/profile
export type UpdateProfileRequest = Partial<
  Pick<User, 'fullName' | 'phoneNum' | 'avatar'>
>;
export type UpdateProfileResponse = ApiResponse<
  Pick<User, 'userId' | 'fullName'>
>;
