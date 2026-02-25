import { Router } from 'express'
import {
  createSampleController,
  getSamplesController,
  getMockTokenController,
  getAuthSampleController,
  postAuthSampleController
} from '~/controllers/sample.controllers'
import { createSampleValidator, accessTokenValidator } from '~/middlewares/sample.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const sampleRouter = Router()

/**
 * Description: Get all samples
 * Path: /
 * Method: GET
 */
sampleRouter.get('/', wrapRequestHandler(getSamplesController))

/**
 * Description: Create a new sample
 * Path: /
 * Method: POST
 * Body: { name: string, description?: string }
 */
sampleRouter.post(
  '/',
  createSampleValidator, // Validate dữ liệu trước tiên
  wrapRequestHandler(createSampleController) //
)

/**
 * Description: Generate a mock access token for testing protected routes
 * Path: /auth/mock-token
 * Method: GET
 */
sampleRouter.get('/auth/mock-token', wrapRequestHandler(getMockTokenController))

/**
 * Description: Get a sample with authentication
 * Path: /auth
 * Method: GET
 * Header: Authorization: Bearer <access_token>
 */
sampleRouter.get('/auth', accessTokenValidator, wrapRequestHandler(getAuthSampleController))

/**
 * Description: Create a new sample with authentication
 * Path: /auth
 * Method: POST
 * Header: Authorization: Bearer <access_token>
 * Body: { name: string, description?: string }
 */
sampleRouter.post('/auth', accessTokenValidator, createSampleValidator, wrapRequestHandler(postAuthSampleController))

export default sampleRouter
