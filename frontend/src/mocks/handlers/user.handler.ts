import { http, HttpResponse } from 'msw';
import { BASE_URL } from '@/constants/api';
import { MOCK_USERS, MOCK_SESSIONS } from '../data/users';
import {
  GetProfileResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
} from '@/types/user.types';

export const userHandlers = [
  // GET /users/profile
  http.get<{}, never, GetProfileResponse>(
    `${BASE_URL}/users/profile`,
    ({ request }) => {
      // 1. Lấy Token từ Header (Chuẩn Bearer Token)
      const authHeader = request.headers.get('Authorization');
      const token = authHeader?.split(' ')[1];

      // 2. Kiểm tra tính hợp lệ của Token
      if (!token) {
        return HttpResponse.json(
          { message: 'Bạn chưa đăng nhập', data: null },
          { status: 401 },
        );
      }

      // 3. Giả lập logic tìm đúng User dựa trên Token
      // Trong thực tế, Token sẽ chứa userId. Ở đây ta giả lập logic map token -> user
      // 1️⃣ Tìm session từ token
      const session = MOCK_SESSIONS.find((s) => s.accessToken === token);

      if (!session) {
        return HttpResponse.json(
          { message: 'Token không hợp lệ', data: null },
          { status: 403 },
        );
      }

      // 2️⃣ Tìm user từ userId
      const user = MOCK_USERS.find((u) => u.userId === session.userId);

      if (!user) {
        return HttpResponse.json(
          {
            message: 'Token không hợp lệ hoặc người dùng không tồn tại',
            data: null,
          },
          { status: 403 },
        );
      }

      // 4. Trả về dữ liệu của đúng người dùng đó
      return HttpResponse.json(
        {
          message: 'Lấy thông tin thành công',
          data: {
            userId: user.userId,
            fullName: user.fullName,
            email: user.email,
            phoneNum: user.phoneNum,
          },
        },
        { status: 200 },
      );
    },
  ),

  // PUT /users/profile
  http.put<{}, UpdateProfileRequest, UpdateProfileResponse>(
    `${BASE_URL}/users/profile`,
    async ({ request }) => {
      // 1. Lấy Token từ Header
      const authHeader = request.headers.get('Authorization');
      const token = authHeader?.split(' ')[1]; // Cắt bỏ chữ "Bearer "

      // 2. Giả lập logic kiểm tra Token
      if (!token || token === 'expired-token') {
        return HttpResponse.json(
          {
            message: 'Phiên đăng nhập hết hạn hoặc không hợp lệ',
            data: null,
          },
          { status: 401 },
        );
      }

      // 3. Giả lập việc "Giải mã" Token để tìm User
      // Trong thực tế bạn dùng JWT, ở đây ta giả định token 'user-123-token' thuộc về user có id '123'
      const userId = token === 'admin-token' ? 'admin-id' : 'user-123';

      const body = await request.json();
      const user = MOCK_USERS.find((u) => u.userId === userId);

      if (!user) {
        return HttpResponse.json(
          {
            message: 'Người dùng không tồn tại',
            data: null,
          },
          { status: 404 },
        );
      }

      // 4. Update logic
      user.fullName = body.fullName || user.fullName;
      // ... update các field khác

      return HttpResponse.json({
        message: 'Cập nhật thành công',
        data: { userId: user.userId, fullName: user.fullName },
      });
    },
  ),
];
