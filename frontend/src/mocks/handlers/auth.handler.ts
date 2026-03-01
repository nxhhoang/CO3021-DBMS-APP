import { http, HttpResponse } from 'msw';
import { BASE_URL } from '@/constants/api';
import { MOCK_USERS } from '../data/users';

let currentRefreshToken = 'mock-refresh-token';
export const authHandlers = [
  // 1. Mock Đăng ký (POST /auth/register)
  http.post(`${BASE_URL}/auth/register`, async ({ request }) => {
    const newUser = (await request.json()) as any;

    const exitstingUser = MOCK_USERS.find((u) => u.email === newUser.email);

    if (exitstingUser) {
      return HttpResponse.json(
        { message: 'Email đã tồn tại', data: null },
        { status: 400 },
      );
    }
    MOCK_USERS.push({
      ...newUser,
      userId: `uuid-${Math.random()}`,
      role: 'CUSTOMER',
    });

    return HttpResponse.json(
      {
        message: 'Đăng ký thành công',
        data: {
          userId: 'uuid-gen-' + Math.random().toString(36).substr(2, 9),
          email: newUser.email,
        },
      },
      { status: 201 },
    );
  }),
  // 2. Mock Đăng nhập (POST /auth/login)
  http.post(`${BASE_URL}/auth/login`, async ({ request }) => {
    const { email, password } = (await request.json()) as any;

    // Tìm user trong file data/users.ts
    const user = MOCK_USERS.find(
      (u) => u.email === email && u.password === password,
    );

    if (!user) {
      return HttpResponse.json(
        { message: 'Email hoặc mật khẩu không đúng', data: null },
        { status: 401 },
      );
    }

    return HttpResponse.json({
      message: 'Đăng nhập thành công',
      data: {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        user: {
          userId: user.userId,
          role: user.role,
        },
      },
    });
  }),

  // 3. Mock Refresh Token Rotation (POST /auth/refresh-token)
  http.post(`${BASE_URL}/auth/refresh-token`, async ({ request }) => {
    const { refreshToken } = (await request.json()) as { refreshToken: string };

    // Kiểm tra token gửi lên có hợp lệ/khớp với "DB" không
    if (!refreshToken || refreshToken !== currentRefreshToken) {
      return HttpResponse.json(
        {
          message: 'Refresh Token không hợp lệ hoặc đã hết hạn',
          data: null,
        },
        { status: 401 },
      );
    }

    // Tạo cặp token mới (Rotation)
    const newAccessToken = `new-access-token-ey-${Math.random().toString(36).substring(7)}`;
    const newRefreshToken = `new-refresh-token-${Math.random().toString(36).substring(7)}`;

    // Cập nhật lại "DB" giả lập với token mới
    currentRefreshToken = newRefreshToken;

    return HttpResponse.json(
      {
        message: 'Cấp lại token thành công',
        data: {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        },
      },
      { status: 200 },
    );
  }),

  // 4. Mock API kiểm tra Profile (Dùng để test đính kèm Token)
  http.get(`${BASE_URL}/auth/me`, ({ request }) => {
    // Lấy Header Authorization từ request gửi lên
    const authHeader = request.headers.get('Authorization');

    // Nếu không có Header này, trả về 401 luôn
    if (!authHeader) {
      return HttpResponse.json(
        { message: 'Không tìm thấy Token!' },
        { status: 401 },
      );
    }

    // Nếu có, trả về dữ liệu kèm theo cái Header đó để mình "nhìn tận mắt"
    return HttpResponse.json({
      message: 'Token hợp lệ!',
      yourTokenWas: authHeader, // Trả ngược lại token để bạn đối chiếu
      user: MOCK_USERS[0],
    });
  }),

  http.get(`${BASE_URL}/test-401`, ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    // Giả sử token cũ bạn đặt là 'expired-token'
    // Còn token mới MSW trả về có định dạng 'new-access-token-ey-...'
    if (authHeader && authHeader.includes('new-access-token')) {
      return HttpResponse.json(
        {
          message: 'Interceptor đã cứu tôi thành công!',
          data: 'Dữ liệu mật đây rồi',
        },
        { status: 200 },
      ); // Trả về 200 nếu thấy token mới
    }

    // Mặc định trả về 401 nếu token không đúng hoặc là token cũ
    return new HttpResponse(null, { status: 401 });
  }),
];
