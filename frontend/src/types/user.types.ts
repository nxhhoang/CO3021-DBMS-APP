import { ApiResponse } from './api.types';
import { ROLE } from '@/constants/enum';

export interface User {
  userId: string;
  fullName: string;
  email: string;
  phoneNum: string;
  role: keyof typeof ROLE;
}

export interface UserWithCredentials extends User {
  password: string;
}


//GET /users/profile
export type GetProfileResponse = ApiResponse<User>;

//PUT /users/profile
export type UpdateProfileRequest = Partial<
  Pick<User, 'fullName' | 'phoneNum'>
>;

export type UpdateProfileResponse = ApiResponse<
  Pick<User, 'userId' | 'fullName'>
>;
