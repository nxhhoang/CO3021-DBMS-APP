import { JwtPayload } from 'jsonwebtoken'
import { TokenType, UserVerifyStatus } from '~/constants/enums'

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

export interface TokenPayload extends JwtPayload {
  user_id: string
  token_type: TokenType
  verify: UserVerifyStatus
  exp: number
  iat: number
}
