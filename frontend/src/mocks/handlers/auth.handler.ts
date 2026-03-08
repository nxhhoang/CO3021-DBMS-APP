import { http, HttpResponse } from 'msw';
import { BASE_URL } from '@/constants/api';
import { MOCK_USERS, MOCK_SESSIONS } from '../data/users';
import {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  RegisterRequest,
  RegisterResponse,
  LogoutRequest,
  LogoutResponse,
} from '@/types/auth.types';

export const authHandlers = [
  // POST /auth/login
  http.post<never, LoginRequest, LoginResponse>(
    `${BASE_URL}/auth/login`,
    async ({ request }) => {
      const { email, password } = await request.json();

      // Tìm user trong mock database
      const user = MOCK_USERS.find(
        (u) => u.email === email && u.password === password,
      );

      if (!user) {
        return HttpResponse.json(
          { message: 'Email hoặc mật khẩu không đúng', data: null },
          { status: 401 },
        );
      }

      // Tạo session giả lập (trong thực tế sẽ tạo token JWT)
      const session = {
        accessToken: `access-token-customer`,
        refreshToken: `refresh-token-customer`,
        userId: user.userId,
      };

      // Lưu session vào mock sessions
      MOCK_SESSIONS.push(session);

      return HttpResponse.json({
        message: 'Đăng nhập thành công',
        data: {
          accessToken: session.accessToken,
          refreshToken: session.refreshToken,
          user: {
            userId: user.userId,
            role: user.role,
          },
        },
      });
    },
  ),

  // POST /auth/refresh-token
  http.post<never, RefreshTokenRequest, RefreshTokenResponse>(
    `${BASE_URL}/auth/refresh-token`,
    async ({ request }) => {
      const { refreshToken } = await request.json();

      // Tìm session dựa trên refresh token
      const sessionIndex = MOCK_SESSIONS.findIndex(
        (s) => s.refreshToken === refreshToken,
      );

      if (sessionIndex === -1) {
        return HttpResponse.json(
          { message: 'Refresh token không hợp lệ', data: null },
          { status: 401 },
        );
      }

      // Tạo access token mới
      const newAccessToken = `access-token-${MOCK_SESSIONS[sessionIndex].userId}-${Date.now()}`;

      // Tạo refresh token mới
      const newRefreshToken = `refresh-token-${MOCK_SESSIONS[sessionIndex].userId}-${Date.now()}`;

      // Cập nhật session với access token và refresh token mới
      MOCK_SESSIONS[sessionIndex].accessToken = newAccessToken;
      MOCK_SESSIONS[sessionIndex].refreshToken = newRefreshToken;

      return HttpResponse.json({
        message: 'Làm mới token thành công',
        data: {
          accessToken: newAccessToken,
          refreshToken: MOCK_SESSIONS[sessionIndex].refreshToken,
        },
      });
    },
  ),

  // POST /auth/register
  http.post<never, RegisterRequest, RegisterResponse>(
    `${BASE_URL}/auth/register`,
    async ({ request }) => {
      const { fullName, email, phoneNum, password } = await request.json();

      // Kiểm tra nếu email đã tồn tại
      if (MOCK_USERS.some((u) => u.email === email)) {
        return HttpResponse.json(
          { message: 'Email đã được sử dụng', data: null },
          { status: 400 },
        );
      }

      // Tạo user mới
      const newUser = {
        userId: `user-${Date.now()}`,
        fullName,
        email,
        phoneNum,
        role: 'CUSTOMER' as const,
        avatar: '',
        password,
      };

      // Thêm user vào mock database
      MOCK_USERS.push(newUser);

      return HttpResponse.json(
        {
          message: 'Đăng ký thành công',
          data: {
            userId: newUser.userId,
            email: newUser.email,
          },
        },
        { status: 201 },
      );
    },
  ),
  // POST /auth/logout
  http.post<never, LogoutRequest, LogoutResponse>(
    `${BASE_URL}/auth/logout`,
    async ({ request }) => {
      const { refreshToken } = await request.json();

      // Tìm session dựa trên refresh token
      const sessionIndex = MOCK_SESSIONS.findIndex(
        (s) => s.refreshToken === refreshToken,
      );

      if (sessionIndex === -1) {
        return HttpResponse.json(
          { message: 'Refresh token không hợp lệ', data: null },
          { status: 401 },
        );
      }

      // Xóa session khỏi mock sessions
      MOCK_SESSIONS.splice(sessionIndex, 1);

      return HttpResponse.json(
        {
          message: 'Đăng xuất thành công',
          data: null,
        },
        { status: 200 },
      );
    },
  ),
];
