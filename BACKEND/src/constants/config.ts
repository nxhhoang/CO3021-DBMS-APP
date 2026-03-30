// import { config } from 'dotenv'
// import fs from 'fs'
// import path from 'path'
// const env = process.env.NODE_ENV
// const envFilename = `.env.${env}`
// if (!env) {
//   console.log(`Bạn chưa cung cấp biến môi trường NODE_ENV (ví dụ: development, production)`)
//   console.log(`Phát hiện NODE_ENV = ${env}`)
//   process.exit(1)
// }
// console.log(`Phát hiện NODE_ENV = ${env}, vì thế app sẽ dùng file môi trường là ${envFilename}`)
// if (!fs.existsSync(path.resolve(envFilename))) {
//   console.log(`Không tìm thấy file môi trường ${envFilename}`)
//   console.log(`Lưu ý: App không dùng file .env, ví dụ môi trường là development thì app sẽ dùng file .env.development`)
//   console.log(`Vui lòng tạo file ${envFilename} và tham khảo nội dung ở file .env.example`)
//   process.exit(1)
// }
// config({
//   path: envFilename
// })
// export const isProduction = env === 'production'

// export const envConfig = {
//   port: (process.env.PORT as string) || 4000,
//   host: process.env.HOST as string,
//   dbName: process.env.DB_NAME as string,
//   dbUsername: process.env.DB_USERNAME as string,
//   dbPassword: process.env.DB_PASSWORD as string,
//   dbTweetsCollection: process.env.DB_TWEETS_COLLECTION as string,
//   dbUsersCollection: process.env.DB_USERS_COLLECTION as string,
//   dbHashtagsCollection: process.env.DB_HASHTAGS_COLLECTION as string,
//   dbBookmarksCollection: process.env.DB_BOOKMARKS_COLLECTION as string,
//   dbLikesCollection: process.env.DB_LIKES_COLLECTION as string,
//   dbRefreshTokensCollection: process.env.DB_REFRESH_TOKENS_COLLECTION as string,
//   dbFollowersCollection: process.env.DB_FOLLOWERS_COLLECTION as string,
//   dbVideoStatusCollection: process.env.DB_VIDEO_STATUS_COLLECTION as string,
//   dbConversationCollection: process.env.DB_CONVERSATION_COLLECTION as string,
//   passwordSecret: process.env.PASSWORD_SECRET as string,
//   jwtSecretAccessToken: process.env.JWT_SECRET_ACCESS_TOKEN as string,
//   jwtSecretRefreshToken: process.env.JWT_SECRET_REFRESH_TOKEN as string,
//   jwtSecretEmailVerifyToken: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string,
//   jwtSecretForgotPasswordToken: process.env.JWT_SECRET_FORGOT_PASSWORD_TOKEN as string,
//   refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN as string,
//   accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN as string,
//   emailVerifyTokenExpiresIn: process.env.EMAIL_VERIFY_TOKEN_EXPIRES_IN as string,
//   forgotPasswordTokenExpiresIn: process.env.FORGOT_PASSWORD_TOKEN_EXPIRES_IN as string,
//   googleClientId: process.env.GOOGLE_CLIENT_ID as string,
//   googleClientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
//   googleRedirectUri: process.env.GOOGLE_REDIRECT_URI as string,
//   clientRedirectCallback: process.env.CLIENT_REDIRECT_CALLBACK as string,
//   clientUrl: process.env.CLIENT_URL as string,
//   awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
//   awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
//   awsRegion: process.env.AWS_REGION as string,
//   sesFromAddress: process.env.SES_FROM_ADDRESS as string,
//   s3BucketName: process.env.S3_BUCKET_NAME as string
// }
import { config } from 'dotenv'
import fs from 'fs'
import path from 'path'

const env = process.env.NODE_ENV || 'development'
const envFilename = `.env`

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
  
  // MongoDB
  mongoHost: (process.env.MONGO_HOST as string) || 'localhost',
  mongoPort: parseInt(process.env.MONGO_PORT as string) || 27017,
  mongoUser: process.env.MONGO_USER as string,
  mongoPassword: process.env.MONGO_PASSWORD as string,
  mongoDatabase: (process.env.MONGO_DATABASE as string) || 'ecommerce_db',

  // dbHost: process.env.DB_HOST as string,
  // dbPort: parseInt(process.env.DB_PORT as string) || 1433,
  // dbUser: process.env.DB_USER as string,
  // dbPassword: process.env.DB_PASSWORD as string,
  // dbName: process.env.DB_NAME as string,

  // PostgreSQL
  pgHost: (process.env.PG_HOST as string) || 'localhost',
  pgPort: parseInt(process.env.PG_PORT as string) || 5432,
  pgUser: (process.env.PG_USER as string) || 'postgres',
  pgPassword: (process.env.PG_PASSWORD as string) || 'postgres',
  pgDatabase: (process.env.PG_DATABASE as string) || 'ecommerce_db',

  // Auth
  passwordSecret: process.env.PASSWORD_SECRET as string,
  jwtSecretAccessToken: process.env.JWT_SECRET_ACCESS_TOKEN as string,
  jwtSecretRefreshToken: process.env.JWT_SECRET_REFRESH_TOKEN as string,
  refreshTokenExpiresIn: (process.env.REFRESH_TOKEN_EXPIRES_IN as string) || '7d',
  accessTokenExpiresIn: (process.env.ACCESS_TOKEN_EXPIRES_IN as string) || '15m',

  clientUrl: process.env.CLIENT_URL as string
}
