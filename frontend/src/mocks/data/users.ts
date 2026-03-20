import { TokenPayload } from '@/types';
import { UserWithCredentials } from '@/features/user';

export const MOCK_USERS: UserWithCredentials[] = [
  {
    userId: 'user-admin-001',
    fullName: 'Admin',
    email: 'admin@example.com',
    phoneNum: '0900000000',
    role: 'ADMIN',
    avatar: '',
    password: '123',
  },
  {
    userId: 'user-customer-001',
    fullName: 'Customer',
    email: 'customer@example.com',
    phoneNum: '0911111111',
    role: 'CUSTOMER',
    avatar: '',
    password: '123',
  },
];

// Giả lập bảng Sessions/Tokens
export const MOCK_SESSIONS: (TokenPayload & { userId: string })[] = [
  {
    accessToken: 'access-token-admin',
    refreshToken: 'refresh-token-admin',
    userId: 'user-admin-001',
  },
  {
    accessToken: 'access-token-customer',
    refreshToken: 'refresh-token-customer',
    userId: 'user-customer-001',
  },
];
