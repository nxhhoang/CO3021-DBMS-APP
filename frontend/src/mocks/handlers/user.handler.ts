import { http, HttpResponse } from 'msw'
import { BASE_URL } from '@/constants/api'
import { findUserById, mockDb, requireSession } from '../data/mockDb'
import {
  GetProfileResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
} from '@/types/user.types'

export const userHandlers = [
  // GET /users/profile
  http.get<Record<string, never>, never, GetProfileResponse>(
    `${BASE_URL}/users/profile`,
    ({ request }) => {
      const auth = requireSession(request.headers.get('Authorization'))
      if (!auth.ok) return HttpResponse.json(auth.response, { status: auth.status })

      const user = findUserById(auth.session.userId)
      if (!user) {
        return HttpResponse.json(
          { message: 'Người dùng không tồn tại', data: null },
          { status: 404 },
        )
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
            role: user.role,
          },
        },
        { status: 200 },
      )
    },
  ),

  // PUT /users/profile
  http.put<Record<string, never>, UpdateProfileRequest, UpdateProfileResponse>(
    `${BASE_URL}/users/profile`,
    async ({ request }) => {
      const auth = requireSession(request.headers.get('Authorization'))
      if (!auth.ok) return HttpResponse.json(auth.response, { status: auth.status })

      const userIndex = mockDb.users.findIndex((u) => u.userId === auth.session.userId)
      const user = mockDb.users[userIndex]
      if (!user) return HttpResponse.json({ message: 'Người dùng không tồn tại', data: null }, { status: 404 })

      // 4. Update logic
      const body = await request.json()

      // Cập nhật vào mảng mock (lưu ý: cách này chỉ lưu vào bộ nhớ tạm của trình duyệt)
      mockDb.users[userIndex] = {
        ...user,
        fullName: body.fullName ?? user.fullName,
        phoneNum: body.phoneNum ?? user.phoneNum,
      }

      return HttpResponse.json({
        message: 'Cập nhật thành công',
        data: {
          userId: mockDb.users[userIndex].userId,
          fullName: mockDb.users[userIndex].fullName,
        },
      })
    },
  ),
]

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
