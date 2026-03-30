import { Router } from 'express'
import {
  getProfileController,
  updateProfileController,
  getAddressesController,
  createAddressController,
  updateAddressController,
  deleteAddressController,
  setDefaultAddressController
} from '~/controllers/user.controllers'
import { accessTokenValidator } from '~/middlewares/auth.middlewares'
import { updateProfileValidator, createAddressValidator, updateAddressValidator } from '~/middlewares/user.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const userRouter = Router()

// All user routes require authentication
userRouter.use(accessTokenValidator)

/**
 * GET /api/v1/users/profile
 */
userRouter.get('/profile', wrapRequestHandler(getProfileController))

/**
 * PUT /api/v1/users/profile
 * Body: { fullName?, phoneNum?, avatar? }
 */
userRouter.put('/profile', updateProfileValidator, wrapRequestHandler(updateProfileController))

/**
 * GET /api/v1/users/addresses
 */
userRouter.get('/addresses', wrapRequestHandler(getAddressesController))

/**
 * POST /api/v1/users/addresses
 * Body: { addressLine, addressName?, city, district, isDefault? }
 */
userRouter.post('/addresses', createAddressValidator, wrapRequestHandler(createAddressController))

/**
 * PUT /api/v1/users/addresses/:addressID
 */
userRouter.put('/addresses/:addressID', updateAddressValidator, wrapRequestHandler(updateAddressController))

/**
 * DELETE /api/v1/users/addresses/:addressID
 */
userRouter.delete('/addresses/:addressID', wrapRequestHandler(deleteAddressController))

/**
 * PATCH /api/v1/users/addresses/:addressID/set-default
 */
userRouter.patch('/addresses/:addressID/set-default', wrapRequestHandler(setDefaultAddressController))

export default userRouter
