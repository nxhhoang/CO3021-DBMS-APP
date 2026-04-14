import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import HTTP_STATUS from '~/constants/httpStatus'
import { PRODUCT_MESSAGES } from '~/constants/messages'
import {
  CreateProductReqBody,
  ProductReqParams,
  SearchProductQuery,
  UpdateProductReqBody
} from '~/models/requests/Product.requests'
import productService from '~/services/product.services'

export const searchProductsController = async (
  req: Request<ParamsDictionary, any, any, SearchProductQuery>,
  res: Response
) => {
  const result = await productService.searchProducts(req.query)
  res.status(HTTP_STATUS.OK).json({
    message: `${PRODUCT_MESSAGES.PRODUCTS_FETCHED} (${result.pagination.totalItems})`,
    data: result
  })
}

export const getProductDetailController = async (req: Request<ProductReqParams>, res: Response) => {
  const { productId } = req.params
  const result = await productService.getProductById(productId)
  res.status(HTTP_STATUS.OK).json({
    message: PRODUCT_MESSAGES.PRODUCT_FETCHED,
    data: result
  })
}

export const createProductController = async (
  req: Request<ParamsDictionary, any, CreateProductReqBody>,
  res: Response
) => {
  const result = await productService.createProduct(req.body)
  res.status(HTTP_STATUS.CREATED).json({
    message: PRODUCT_MESSAGES.PRODUCT_CREATED,
    data: result
  })
}

export const updateProductController = async (
  req: Request<ProductReqParams, any, UpdateProductReqBody>,
  res: Response
) => {
  const { productId } = req.params
  const result = await productService.updateProduct(productId, req.body)
  res.status(HTTP_STATUS.OK).json({
    message: PRODUCT_MESSAGES.PRODUCT_UPDATED,
    data: result
  })
}

export const deleteProductController = async (req: Request<ProductReqParams>, res: Response) => {
  const { productId } = req.params
  const result = await productService.softDeleteProduct(productId)
  res.status(HTTP_STATUS.OK).json({
    message: PRODUCT_MESSAGES.PRODUCT_DELETED,
    data: result
  })
}
