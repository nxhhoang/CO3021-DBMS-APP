import { http, HttpResponse } from 'msw';
import { BASE_URL } from '@/constants/api';

interface LoginBody {
  username: string;
  // các field khác nếu có...
}

export const handlers = [
  // Giả lập một yêu cầu GET
  http.get('/api/users', () => {
    return HttpResponse.json([
      { id: 1, name: 'Gemini', role: 'CUSTOMER' },
      { id: 2, name: 'Frontend Dev', role: 'CUSTOMER' },
    ]);
  }),

  // Giả lập một yêu cầu POST với xử lý logic
  http.post('/api/login', async ({ request }) => {
    const info = (await request.json()) as LoginBody;
    if (info.username === 'username@') {
      return HttpResponse.json({ token: 'mock-token-123' });
    }
    return new HttpResponse(null, { status: 401 });
  }),

  /**
   * POST /api/v1/auth/login
   */
  http.post(`${BASE_URL}/auth/login`, async ({ request }) => {
    const body = await request.json();

    const { email, password, userAgent } = body as {
      email: string;
      password: string;
      userAgent: string;
    };

    // Fake validation
    if (!email || !password) {
      return HttpResponse.json(
        {
          message: 'Thiếu email hoặc mật khẩu',
          data: {},
        },
        { status: 400 },
      );
    }

    // Giả lập login thành công
    if (email === 'user@example.com' && password === '123456') {
      return HttpResponse.json(
        {
          message: 'Đăng nhập thành công',
          data: {
            accessToken: 'ey.mocked-access-token',
            refreshToken: 'mocked-refresh-token-db',
            user: {
              userId: 'user-123',
              role: 'CUSTOMER',
            },
          },
        },
        { status: 200 },
      );
    }

    // Sai thông tin đăng nhập
    return HttpResponse.json(
      {
        message: 'Email hoặc mật khẩu không đúng',
        data: {},
      },
      { status: 401 },
    );
  }),
];
