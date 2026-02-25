import { CreateSampleReqBody } from '~/models/requests/Sample.requests'
import { signToken } from '~/utils/jwt'
import { envConfig } from '~/constants/config'
import { TokenType, UserVerifyStatus } from '~/constants/enums'

class SampleService {
  async getSamples() {
    return [
      { id: '1', name: 'Sample 1', description: 'This is sample 1', created_at: new Date() },
      { id: '2', name: 'Sample 2', description: 'This is sample 2', created_at: new Date() }
    ]
  }

  async createSample(payload: CreateSampleReqBody) {
    const newSample = {
      id: Math.random().toString(36).substring(2, 9),
      ...payload,
      created_at: new Date()
    }
    return newSample
  }

  async generateMockToken() {
    // Tạo một payload giả định thay vì lấy từ Database
    const payload = {
      user_id: 'fake-user-id-123456',
      token_type: TokenType.AccessToken,
      verify: UserVerifyStatus.Verified,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 // Hết hạn sau 1 ngày
    }

    const access_token = await signToken({
      payload,
      privateKey: envConfig.jwtSecretAccessToken,
      options: { algorithm: 'HS256' } // Bỏ expiresIn vì đã set trực tiếp exp trong payload
    })

    return access_token
  }
}

const sampleService = new SampleService()
export default sampleService
