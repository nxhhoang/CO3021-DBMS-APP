import { JwtPayload } from 'jsonwebtoken'
import { TokenType, UserRole } from '~/constants/enums'

export interface RegisterReqBody {
  email: string
  password: string
  fullName: string
  phoneNum: string
}

export interface LoginReqBody {
  email: string
  password: string
  userAgent?: string
}

export interface RefreshTokenReqBody {
  refreshToken: string
}

export interface LogoutReqBody {
  refreshToken: string
}

export interface TokenPayload extends JwtPayload {
  userId: string
  tokenType: TokenType
  role: UserRole
  exp: number
  iat: number
}
