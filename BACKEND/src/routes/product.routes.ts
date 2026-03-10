import { Router } from 'express'
import {
  searchProductsController,
  getProductDetailController,
  createProductController,
  updateProductController,
  deleteProductController
} from '~/controllers/product.controllers'
import {
  getReviewsController,
  createReviewController
} from '~/controllers/review.controllers'
import {
  searchProductValidator,
  productIdParamValidator,
  createProductValidator,
  updateProductValidator
} from '~/middlewares/product.middlewares'
import {
  createReviewValidator
} from '~/middlewares/review.middlewares'
import { accessTokenValidator } from '~/middlewares/sample.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const productRouter = Router()

/**
 * Description: Search & filter products (public)
 * Path: /
 * Method: GET
 * Query: keyword, categoryId, price_min, price_max, page, limit, attrs[key]
 */
productRouter.get('/', searchProductValidator, wrapRequestHandler(searchProductsController))

/**
 * Description: Admin — Create a new product
 * Path: /admin
 * Method: POST
 * Header: Authorization: Bearer <access_token>
 * Body: CreateProductReqBody
 */
productRouter.post('/admin', accessTokenValidator, createProductValidator, wrapRequestHandler(createProductController))

/**
 * Description: Admin — Update a product
 * Path: /admin/:productId
 * Method: PUT
 * Header: Authorization: Bearer <access_token>
 * Params: productId (MongoDB ObjectId)
 * Body: UpdateProductReqBody
 */
productRouter.put(
  '/admin/:productId',
  accessTokenValidator,
  productIdParamValidator,
  updateProductValidator,
  wrapRequestHandler(updateProductController)
)

/**
 * Description: Admin — Soft delete a product (set is_active = false)
 * Path: /admin/:productId
 * Method: DELETE
 * Header: Authorization: Bearer <access_token>
 * Params: productId (MongoDB ObjectId)
 */
productRouter.delete(
  '/admin/:productId',
  accessTokenValidator,
  productIdParamValidator,
  wrapRequestHandler(deleteProductController)
)

/**
 * Description: Get product detail (public, hybrid Mongo+Postgres)
 * Path: /:productId
 * Method: GET
 * Params: productId (MongoDB ObjectId)
 */
productRouter.get('/:productId', productIdParamValidator, wrapRequestHandler(getProductDetailController))

/**
 * Description: Get reviews for a product (public)
 * Path: /:productId/reviews
 * Method: GET
 * Params: productId (MongoDB ObjectId)
 */
productRouter.get('/:productId/reviews', productIdParamValidator, wrapRequestHandler(getReviewsController))

/**
 * Description: Submit a review for a product
 * Path: /:productId/reviews
 * Method: POST
 * Header: Authorization: Bearer <access_token>
 * Params: productId (MongoDB ObjectId)
 * Body: CreateReviewReqBody
 */
productRouter.post(
  '/:productId/reviews',
  accessTokenValidator,
  productIdParamValidator,
  createReviewValidator,
  wrapRequestHandler(createReviewController)
)

export default productRouter
