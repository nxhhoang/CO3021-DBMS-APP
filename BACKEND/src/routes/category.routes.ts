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
const adminCategoryRouter = Router()

/**
 * Description: Get list of categories (public, default isActive=true)
 * Path: /
 * Method: GET
 * Query: ?isActive=true|false
 */
categoryRouter.get('/', wrapRequestHandler(getCategoriesController))

/**
 * Description: Admin — Create a new category
 * Path: /admin/categories
 * Method: POST
 * Header: Authorization: Bearer <access_token>
 * Body: CreateCategoryReqBody
 */
adminCategoryRouter.post('/', accessTokenValidator, createCategoryValidator, wrapRequestHandler(createCategoryController))

/**
 * Description: Admin — Update a category
 * Path: /admin/categories/:id
 * Method: PUT
 * Header: Authorization: Bearer <access_token>
 * Params: id (MongoDB ObjectId)
 * Body: UpdateCategoryReqBody
 */
adminCategoryRouter.put(
  '/:id',
  accessTokenValidator,
  categoryIdValidator,
  updateCategoryValidator,
  wrapRequestHandler(updateCategoryController)
)

/**
 * Description: Admin — Soft delete a category (set isActive = false)
 * Path: /admin/categories/:id
 * Method: DELETE
 * Header: Authorization: Bearer <access_token>
 * Params: id (MongoDB ObjectId)
 */
adminCategoryRouter.delete(
  '/:id',
  accessTokenValidator,
  categoryIdValidator,
  wrapRequestHandler(deleteCategoryController)
)

export { categoryRouter, adminCategoryRouter }
