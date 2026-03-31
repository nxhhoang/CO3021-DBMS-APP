import { query, getClient } from '~/utils/postgres'
import { hashPassword } from '~/utils/crypto'
import { signToken, verifyToken } from '~/utils/jwt'
import { envConfig } from '~/constants/config'
import { TokenType, UserRole } from '~/constants/enums'
import { RegisterReqBody, LoginReqBody } from '~/models/requests/Auth.requests'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'
import { AUTH_MESSAGES } from '~/constants/messages'
import crypto from 'crypto' // Cần sinh unique ID cho bảng USERS

class AuthService {
  //  Token Helpers

  private async signAccessToken(userId: string, role: UserRole) {
    return signToken({
      payload: {
        userId,
        role,
        token_type: TokenType.AccessToken
      },
      privateKey: envConfig.jwtSecretAccessToken,
      options: { expiresIn: envConfig.accessTokenExpiresIn as `${number}${'d' | 'h' | 'm' | 's'}` }
    })
  }

  private async signRefreshToken(userId: string, role: UserRole) {
    return signToken({
      payload: {
        userId,
        role,
        token_type: TokenType.RefreshToken
      },
      privateKey: envConfig.jwtSecretRefreshToken,
      options: { expiresIn: envConfig.refreshTokenExpiresIn as `${number}${'d' | 'h' | 'm' | 's'}` }
    })
  }

  private async signTokenPair(userId: string, role: UserRole) {
    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken(userId, role),
      this.signRefreshToken(userId, role)
    ])
    return { accessToken, refreshToken }
  }

  //  Register

  async register(payload: RegisterReqBody) {
    const { email, password, fullName, phoneNum } = payload

    // Check duplicate email
    const existing = await query('SELECT userID FROM USERS WHERE email = $1', [email])
    if (existing.rows.length > 0) {
      throw new ErrorWithStatus({ message: AUTH_MESSAGES.EMAIL_ALREADY_EXISTS, status: HTTP_STATUS.BAD_REQUEST })
    }

    const hashedPassword = hashPassword(password)
    const newUserId = crypto.randomUUID() // Generate ID for Postgres
    const result = await query(
      `INSERT INTO USERS (userID, email, password, fullName, phoneNum, role)
       VALUES ($1, $2, $3, $4, $5, 'CUSTOMER')
       RETURNING userID AS "userId", email`,
      [newUserId, email, hashedPassword, fullName, phoneNum]
    )

    return result.rows[0]
  }

  //  Login

  async login(payload: LoginReqBody) {
    const { email, password } = payload
    const hashedPassword = hashPassword(password)

    const result = await query(`SELECT userID AS "userId", email, role FROM USERS WHERE email = $1 AND password = $2`, [
      email,
      hashedPassword
    ])

    if (result.rows.length === 0) {
      throw new ErrorWithStatus({
        message: AUTH_MESSAGES.EMAIL_OR_PASSWORD_IS_INCORRECT,
        status: HTTP_STATUS.UNAUTHORIZED
      })
    }

    const user = result.rows[0]
    const { accessToken, refreshToken } = await this.signTokenPair(user.userId, user.role)

    // Store refresh token in AUTH_TOKENS table. Add expireAt = NOW() + 100 days
    await query(`INSERT INTO AUTH_TOKENS (userID, refreshToken, userAgent, expireAt) VALUES ($1, $2, $3, NOW() + INTERVAL '100 days')`, [
      user.userId,
      refreshToken,
      payload.userAgent || null
    ])

    return {
      accessToken,
      refreshToken,
      user: {
        userId: user.userId,
        role: user.role
      }
    }
  }

  //  Refresh Token (Rotation)

  async refreshToken(oldRefreshToken: string) {
    // Verify the token first
    let decoded
    try {
      decoded = await verifyToken({ token: oldRefreshToken, secretOrPublicKey: envConfig.jwtSecretRefreshToken })
    } catch {
      throw new ErrorWithStatus({ message: AUTH_MESSAGES.REFRESH_TOKEN_IS_INVALID, status: HTTP_STATUS.UNAUTHORIZED })
    }

    // Check it exists in DB (not already used/deleted)
    const found = await query(`SELECT tokenID FROM AUTH_TOKENS WHERE refreshToken = $1`, [oldRefreshToken])
    if (found.rows.length === 0) {
      throw new ErrorWithStatus({ message: AUTH_MESSAGES.REFRESH_TOKEN_IS_INVALID, status: HTTP_STATUS.UNAUTHORIZED })
    }

    const client = await getClient()
    try {
      await client.query('BEGIN')

      // Delete old token
      await client.query(`DELETE FROM AUTH_TOKENS WHERE refreshToken = $1`, [oldRefreshToken])

      // Issue new pair
      const { accessToken, refreshToken: newRefreshToken } = await this.signTokenPair(decoded.userId, decoded.role)

      // Store new refresh token
      await client.query(`INSERT INTO AUTH_TOKENS (userID, refreshToken, expireAt) VALUES ($1, $2, NOW() + INTERVAL '100 days')`, [decoded.userId, newRefreshToken])

      await client.query('COMMIT')
      return { accessToken, refreshToken: newRefreshToken }
    } catch (err) {
      await client.query('ROLLBACK')
      throw err
    } finally {
      client.release()
    }
  }

  // Logout

  async logout(refreshToken: string) {
    await query(`DELETE FROM AUTH_TOKENS WHERE refreshToken = $1`, [refreshToken])
  }
}

const authService = new AuthService()
export default authService
