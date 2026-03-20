import { User } from '@/types/user.types';


export interface UserWithCredentials extends User {
  password: string;
}

