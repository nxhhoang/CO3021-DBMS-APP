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
import { connectMongo } from '~/utils/mongodb'

//  Routers
import sampleRouter from '~/routes/sample.routes'
import authRouter from '~/routes/auth.routes'
import userRouter from '~/routes/user.routes'
import { orderRouter, paymentRouter, adminRouter } from '~/routes/order.routes'
import { categoryRouter, adminCategoryRouter } from '~/routes/category.routes'
import { productRouter, adminProductRouter } from '~/routes/product.routes'
import logRouter from '~/routes/log.routes'
import inventoryRouter from '~/routes/inventory.routes'
// const file = fs.readFileSync(path.resolve('twitter-swagger.yaml'), 'utf8')
// const swaggerDocument = YAML.parse(file)

//  Swagger
const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'E-commerce API', version: '1.0.0' },
    servers: [{ url: '/api/v1', description: 'API v1' }],
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
  windowMs: 15 * 60 * 1000,
  // Dev: allow 1000 req/window so test suites are not throttled.
  // Production: enforce strict 100 req/15min.
  max: isProduction ? 100 : 1000,
  standardHeaders: true,
  legacyHeaders: false
})
app.use(limiter)

const httpServer = createServer(app)

app.use(helmet())
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10000,
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
app.use(`${BASE}/admin/categories`, adminCategoryRouter)
app.use(`${BASE}/admin/products`, adminProductRouter)
app.use(`${BASE}/categories`, categoryRouter)
app.use(`${BASE}/products`, productRouter)
app.use(`${BASE}/logs`, logRouter)
app.use(`${BASE}/admin/inventories`, inventoryRouter)
app.use(`${BASE}/inventories`, inventoryRouter)

//  Error Handler
app.use(defaultErrorHandler)

//  Start
const port = envConfig.port

Promise.all([connectPostgres(), connectMongo()])
  .then(() => {
    httpServer.listen(port, () => {
      console.log(`Server running on port ${port}`)
    })
  })
  .catch((err) => {
    console.error('Database connection failed:', err)
    process.exit(1)
  })
