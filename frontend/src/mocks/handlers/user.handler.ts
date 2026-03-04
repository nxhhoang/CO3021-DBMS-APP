import { http, HttpResponse } from 'msw';
import { BASE_URL } from '@/constants/api';
import { MOCK_USERS, MOCK_SESSIONS } from '../data/users';
import {
  GetProfileResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
} from '@/types/user.types';
import { api } from '@/lib/axios';

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
  http.put<{}, UpdateProfileRequest, any>(
    `${BASE_URL}/users/profile`,
    async ({ request }) => {
      // 1. Lấy Token từ Header
      const authHeader = request.headers.get('Authorization');
      const token = authHeader?.split(' ')[1];

      // 2. Kiểm tra token có tồn tại trong "Bảng Sessions" không
      const session = MOCK_SESSIONS.find((s) => s.accessToken === token);

      if (!session || token === 'expired-token') {
        return HttpResponse.json(
          { message: 'Phiên đăng nhập hết hạn hoặc không hợp lệ', data: null },
          { status: 401 },
        );
      }

      // 3. Tìm User dựa trên userId từ session vừa tìm được
      const userIndex = MOCK_USERS.findIndex(
        (u) => u.userId === session.userId,
      );
      const user = MOCK_USERS[userIndex];

      if (!user) {
        return HttpResponse.json(
          { message: 'Người dùng không tồn tại', data: null },
          { status: 404 },
        );
      }

      // 4. Update logic
      const body = await request.json();

      // Cập nhật vào mảng mock (lưu ý: cách này chỉ lưu vào bộ nhớ tạm của trình duyệt)
      MOCK_USERS[userIndex] = {
        ...user,
        fullName: body.fullName ?? user.fullName,
        phoneNum: body.phoneNum ?? user.phoneNum,
      };

      return HttpResponse.json({
        message: 'Cập nhật thành công',
        data: {
          userId: MOCK_USERS[userIndex].userId,
          fullName: MOCK_USERS[userIndex].fullName,
        },
      });
    },
  ),
];

// Example for GET /users/profile
// fetch('http://localhost:3000/api/users/profile', {
//   method: 'GET',
//   headers: {
//     'Content-Type': 'application/json',
//     Authorization: 'Bearer user-123-token', // Thay bằng token hợp lệ
//   },
// })
//   .then((response) => response.json())
//   .then((data) => console.log(data))
//   .catch((error) => console.error('Error:', error));

//Example for PUT /users/profile
// fetch('http://localhost:3000/api/v1/users/profile', {
//   method: 'PUT',
//   headers: {
//     'Content-Type': 'application/json',
//     Authorization: 'Bearer access-token-admin', // Thay bằng token hợp lệ
//   },
//   body: JSON.stringify({
//     fullName: 'Nguyen Van B',
//     phoneNum: '0987654321',
//   }),
// })
//   .then((response) => response.json())
//   .then((data) => console.log(data))
//   .catch((error) => console.error('Error:', error));
