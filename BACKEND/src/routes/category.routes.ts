import { Router } from 'express'
import {
  getCategoriesController,
  createCategoryController,
  updateCategoryController,
  deleteCategoryController
} from '~/controllers/category.controllers'
import {
  createCategoryValidator,
  updateCategoryValidator,
  categoryIdValidator
} from '~/middlewares/category.middlewares'
import { accessTokenValidator } from '~/middlewares/sample.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const categoryRouter = Router()

/**
 * Description: Get list of categories (public, default isActive=true)
 * Path: /
 * Method: GET
 * Query: ?isActive=true|false
 */
categoryRouter.get('/', wrapRequestHandler(getCategoriesController))

/**
 * Description: Admin — Create a new category
 * Path: /admin
 * Method: POST
 * Header: Authorization: Bearer <access_token>
 * Body: CreateCategoryReqBody
 */
categoryRouter.post('/admin', accessTokenValidator, createCategoryValidator, wrapRequestHandler(createCategoryController))

/**
 * Description: Admin — Update a category
 * Path: /admin/:id
 * Method: PUT
 * Header: Authorization: Bearer <access_token>
 * Params: id (MongoDB ObjectId)
 * Body: UpdateCategoryReqBody
 */
categoryRouter.put(
  '/admin/:id',
  accessTokenValidator,
  categoryIdValidator,
  updateCategoryValidator,
  wrapRequestHandler(updateCategoryController)
)

/**
 * Description: Admin — Soft delete a category (set isActive = false)
 * Path: /admin/:id
 * Method: DELETE
 * Header: Authorization: Bearer <access_token>
 * Params: id (MongoDB ObjectId)
 */
categoryRouter.delete(
  '/admin/:id',
  accessTokenValidator,
  categoryIdValidator,
  wrapRequestHandler(deleteCategoryController)
)

export default categoryRouter
