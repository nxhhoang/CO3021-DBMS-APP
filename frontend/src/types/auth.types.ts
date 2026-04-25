import { ApiResponse } from './api.types'
import { User } from './user.types'

export type TokenPayload = {
  accessToken: string
  refreshToken: string
}

//POST /auth/register
export type RegisterRequest = Pick<User, 'fullName' | 'email' | 'phoneNum'> & {
  password: string
}

export type RegisterResponse = ApiResponse<Pick<User, 'userId' | 'email'>>

//POST /auth/login
export type LoginRequest = Pick<User, 'email'> & {
  password: string
  userAgent: string
}

export type LoginResponse = ApiResponse<
  TokenPayload & {
    user: Pick<User, 'userId' | 'role'>
  }
>

//POST /auth/refresh-token
export type RefreshTokenRequest = {
  refreshToken: string
}

export type RefreshTokenResponse = ApiResponse<TokenPayload>

//POST /auth/logout
export type LogoutRequest = {
  refreshToken: string
}

export type LogoutResponse = ApiResponse<null>
