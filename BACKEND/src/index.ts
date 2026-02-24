import express from 'express'
import { defaultErrorHandler } from '~/middlewares/error.middlewares'
import cors, { CorsOptions } from 'cors'
import { createServer } from 'http'
import initSocket from '~/utils/socket'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import YAML from 'yaml'
// import fs from 'fs'
// import path from 'path'
import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'
import { envConfig, isProduction } from '~/constants/config'
// const file = fs.readFileSync(path.resolve('twitter-swagger.yaml'), 'utf8')
// const swaggerDocument = YAML.parse(file)

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'X clone (Twitter API)',
      version: '1.0.0'
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        BearerAuth: []
      }
    ],
    persistAuthorization: true
  },
  apis: ['./openapi/*.yaml'] // files containing annotations as above
}
const openapiSpecification = swaggerJsdoc(options)

// databaseService.connect().then(() => {
//   databaseService.indexUsers()
//   databaseService.indexRefreshTokens()
//   databaseService.indexVideoStatus()
//   databaseService.indexFollowers()
//   databaseService.indexTweets()
// })
const app = express()
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false // Disable the `X-RateLimit-*` headers
  // store: ... , // Use an external store for more precise rate limiting
})
app.use(limiter)

const httpServer = createServer(app)
app.use(helmet())
const corsOptions: CorsOptions = {
  origin: isProduction ? envConfig.clientUrl : '*'
}
app.use(cors(corsOptions))
const port = envConfig.port

app.use(express.json())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification))
app.use(defaultErrorHandler)

initSocket(httpServer)

httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
