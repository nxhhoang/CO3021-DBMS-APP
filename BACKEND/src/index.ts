import express from 'express'
import { defaultErrorHandler } from '~/middlewares/error.middlewares'
import cors, { CorsOptions } from 'cors'
import { createServer } from 'http'
// import initSocket from '~/utils/socket'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
// import YAML from 'yaml'
// import fs from 'fs'
// import path from 'path'
import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'
import { envConfig, isProduction } from '~/constants/config'
import { connectPostgres } from '~/utils/postgres'

//  Routers
import sampleRouter from '~/routes/sample.routes'
import authRouter from '~/routes/auth.routes'
import userRouter from '~/routes/user.routes'
import { orderRouter, paymentRouter, adminRouter } from '~/routes/order.routes'

//  Swagger
const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'E-commerce API', version: '1.0.0' },
    components: {
      securitySchemes: {
        BearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
      }
    },
    security: [{ BearerAuth: [] }],
    persistAuthorization: true
  },
  apis: ['./openapi/*.yaml']
}
const openapiSpecification = swaggerJsdoc(options)

//  App Setup
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
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false
  })
)
const corsOptions: CorsOptions = {
  origin: isProduction ? envConfig.clientUrl : '*'
}
app.use(cors(corsOptions))

app.use(express.json())

//  Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification))

//  Routes
const BASE = '/api/v1'

app.use(`${BASE}/samples`, sampleRouter)
app.use(`${BASE}/auth`, authRouter)
app.use(`${BASE}/users`, userRouter)
app.use(`${BASE}/orders`, orderRouter)
app.use(`${BASE}/payments`, paymentRouter)
app.use(`${BASE}/admin`, adminRouter)

//  Error Handler
app.use(defaultErrorHandler)

//  Start
const port = envConfig.port

connectPostgres()
  .then(() => {
    httpServer.listen(port, () => {
      console.log(`Server running on port ${port}`)
    })
  })
  .catch((err) => {
    console.error('Failed to connect to PostgreSQL:', err)
    process.exit(1)
  })
