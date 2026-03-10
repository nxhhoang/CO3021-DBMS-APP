import { query, getClient } from '~/utils/postgres'
import { hashPassword } from '~/utils/crypto'
import { signToken, verifyToken } from '~/utils/jwt'
import { envConfig } from '~/constants/config'
import { TokenType, UserRole } from '~/constants/enums'
import { RegisterReqBody, LoginReqBody } from '~/models/requests/Auth.requests'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'
import { AUTH_MESSAGES } from '~/constants/messages'

class AuthService {
  //  Token Helpers

  private async signAccessToken(user_id: string, role: UserRole) {
    return signToken({
      payload: {
        user_id,
        role,
        token_type: TokenType.AccessToken
      },
      privateKey: envConfig.jwtSecretAccessToken,
      options: { expiresIn: envConfig.accessTokenExpiresIn as `${number}${'d' | 'h' | 'm' | 's'}` }
    })
  }

  private async signRefreshToken(user_id: string, role: UserRole) {
    return signToken({
      payload: {
        user_id,
        role,
        token_type: TokenType.RefreshToken
      },
      privateKey: envConfig.jwtSecretRefreshToken,
      options: { expiresIn: envConfig.refreshTokenExpiresIn as `${number}${'d' | 'h' | 'm' | 's'}` }
    })
  }

  private async signTokenPair(user_id: string, role: UserRole) {
    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken(user_id, role),
      this.signRefreshToken(user_id, role)
    ])
    return { accessToken, refreshToken }
  }

  //  Register

  async register(payload: RegisterReqBody) {
    const { email, password, fullName, phoneNum } = payload

    // Check duplicate email
    const existing = await query('SELECT user_id FROM users WHERE email = $1', [email])
    if (existing.rows.length > 0) {
      throw new ErrorWithStatus({ message: AUTH_MESSAGES.EMAIL_ALREADY_EXISTS, status: HTTP_STATUS.BAD_REQUEST })
    }

    const hashedPassword = hashPassword(password)
    const result = await query(
      `INSERT INTO users (email, password_hash, full_name, phone_num, role)
       VALUES ($1, $2, $3, $4, 'CUSTOMER')
       RETURNING user_id, email`,
      [email, hashedPassword, fullName, phoneNum]
    )

    return result.rows[0]
  }

  //  Login

  async login(payload: LoginReqBody) {
    const { email, password } = payload
    const hashedPassword = hashPassword(password)

    const result = await query(`SELECT user_id, email, role FROM users WHERE email = $1 AND password_hash = $2`, [
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
    const { accessToken, refreshToken } = await this.signTokenPair(user.user_id, user.role)

    // Store refresh token in auth_tokens table
    await query(`INSERT INTO auth_tokens (user_id, token, user_agent) VALUES ($1, $2, $3)`, [
      user.user_id,
      refreshToken,
      payload.userAgent || null
    ])

    return {
      accessToken,
      refreshToken,
      user: {
        userId: user.user_id,
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
    const found = await query(`SELECT token_id FROM auth_tokens WHERE token = $1`, [oldRefreshToken])
    if (found.rows.length === 0) {
      throw new ErrorWithStatus({ message: AUTH_MESSAGES.REFRESH_TOKEN_IS_INVALID, status: HTTP_STATUS.UNAUTHORIZED })
    }

    const client = await getClient()
    try {
      await client.query('BEGIN')

      // Delete old token
      await client.query(`DELETE FROM auth_tokens WHERE token = $1`, [oldRefreshToken])

      // Issue new pair
      const { accessToken, refreshToken: newRefreshToken } = await this.signTokenPair(decoded.user_id, decoded.role)

      // Store new refresh token
      await client.query(`INSERT INTO auth_tokens (user_id, token) VALUES ($1, $2)`, [decoded.user_id, newRefreshToken])

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
    await query(`DELETE FROM auth_tokens WHERE token = $1`, [refreshToken])
  }
}

const authService = new AuthService()
export default authService
