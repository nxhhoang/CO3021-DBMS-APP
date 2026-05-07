import { http, HttpResponse } from 'msw'
import { BASE_URL } from '@/constants/api'
import { mockDb, newId } from '../data/mockDb'
import {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  RegisterRequest,
  RegisterResponse,
  LogoutRequest,
  LogoutResponse,
} from '@/types/auth.types'

export const authHandlers = [
  // POST /auth/login
  http.post<never, LoginRequest, LoginResponse>(
    `${BASE_URL}/auth/login`,
    async ({ request }) => {
      const { email, password } = await request.json()

      // Tìm user trong mock database
      const user = mockDb.users.find((u) => u.email === email && u.password === password)

      if (!user) {
        return HttpResponse.json(
          { message: 'Email hoặc mật khẩu không đúng', data: null },
          { status: 401 },
        )
      }

      // Replace existing session for this user (avoid duplicated sessions)
      mockDb.sessions = mockDb.sessions.filter((s) => s.userId !== user.userId)
      const session = {
        accessToken: `access-${newId(user.role.toLowerCase())}`,
        refreshToken: `refresh-${newId(user.role.toLowerCase())}`,
        userId: user.userId,
      }
      mockDb.sessions.push(session)

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
      })
    },
  ),

  // POST /auth/refresh-token
  http.post<never, RefreshTokenRequest, RefreshTokenResponse>(
    `${BASE_URL}/auth/refresh-token`,
    async ({ request }) => {
      const { refreshToken } = await request.json()

      // Tìm session dựa trên refresh token
      const sessionIndex = mockDb.sessions.findIndex((s) => s.refreshToken === refreshToken)

      if (sessionIndex === -1) {
        return HttpResponse.json(
          { message: 'Refresh token không hợp lệ', data: null },
          { status: 401 },
        )
      }

      const userId = mockDb.sessions[sessionIndex].userId
      const newAccessToken = `access-${newId(userId)}`
      const newRefreshToken = `refresh-${newId(userId)}`

      mockDb.sessions[sessionIndex].accessToken = newAccessToken
      mockDb.sessions[sessionIndex].refreshToken = newRefreshToken

      return HttpResponse.json({
        message: 'Làm mới token thành công',
        data: {
          accessToken: newAccessToken,
          refreshToken: mockDb.sessions[sessionIndex].refreshToken,
        },
      })
    },
  ),

  // POST /auth/register
  http.post<never, RegisterRequest, RegisterResponse>(
    `${BASE_URL}/auth/register`,
    async ({ request }) => {
      const { fullName, email, phoneNum, password } = await request.json()

      // Kiểm tra nếu email đã tồn tại
      if (mockDb.users.some((u) => u.email === email)) {
        return HttpResponse.json(
          { message: 'Email đã được sử dụng', data: null },
          { status: 400 },
        )
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
      }

      // Thêm user vào mock database
      mockDb.users.push(newUser)

      return HttpResponse.json(
        {
          message: 'Đăng ký thành công',
          data: {
            userId: newUser.userId,
            email: newUser.email,
          },
        },
        { status: 201 },
      )
    },
  ),
  // POST /auth/logout
  http.post<never, LogoutRequest, LogoutResponse>(
    `${BASE_URL}/auth/logout`,
    async ({ request }) => {
      const { refreshToken } = await request.json()

      // Tìm session dựa trên refresh token
      const sessionIndex = mockDb.sessions.findIndex((s) => s.refreshToken === refreshToken)

      if (sessionIndex === -1) {
        return HttpResponse.json(
          { message: 'Refresh token không hợp lệ', data: null },
          { status: 401 },
        )
      }

      // Xóa session khỏi mock sessions
      mockDb.sessions.splice(sessionIndex, 1)

      return HttpResponse.json(
        {
          message: 'Đăng xuất thành công',
          data: null,
        },
        { status: 200 },
      )
    },
  ),
]
