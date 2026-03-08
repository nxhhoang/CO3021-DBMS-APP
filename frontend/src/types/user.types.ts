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

export interface UserWithCredentials extends User {
  password: string; // Tên rõ ràng để tránh nhầm lẫn với plain text
}

//GET /users/profile
export type GetProfileResponse = ApiResponse<Omit<User, 'role'>>;

//PUT /users/profile
export type UpdateProfileRequest = Partial<
  Pick<User, 'fullName' | 'phoneNum' | 'avatar'>
>;
export type UpdateProfileResponse = ApiResponse<
  Pick<User, 'userId' | 'fullName'>
>;
