import { config } from 'dotenv'
import fs from 'fs'
import path from 'path'

const env = process.env.NODE_ENV || 'development'
const envFilename = `.env` // Hoặc .env.${env} nếu bạn muốn chia file

if (!fs.existsSync(path.resolve(envFilename))) {
  console.log(`Không tìm thấy file môi trường ${envFilename}`)
  console.log(`Vui lòng tạo file .env dựa trên mẫu`)
  process.exit(1)
}

config({
  path: envFilename
})

export const isProduction = env === 'production'

export const envConfig = {
  port: (process.env.PORT as string) || 4000,
  host: process.env.HOST as string,

  // dbHost: process.env.DB_HOST as string,
  // dbPort: parseInt(process.env.DB_PORT as string) || 1433,
  // dbUser: process.env.DB_USER as string,
  // dbPassword: process.env.DB_PASSWORD as string,
  // dbName: process.env.DB_NAME as string,

  dbMongoUser: process.env.DB_MONGO_USER as string,
  dbMongoPassword: process.env.DB_MONGO_PASSWORD as string,
  passwordSecret: process.env.PASSWORD_SECRET as string,
  jwtSecretAccessToken: process.env.JWT_SECRET_ACCESS_TOKEN as string,
  jwtSecretRefreshToken: process.env.JWT_SECRET_REFRESH_TOKEN as string,
  jwtSecretEmailVerifyToken: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string,
  jwtSecretForgotPasswordToken: process.env.JWT_SECRET_FORGOT_PASSWORD_TOKEN as string,
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN as string,
  accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN as string,

  clientUrl: process.env.CLIENT_URL as string
}
