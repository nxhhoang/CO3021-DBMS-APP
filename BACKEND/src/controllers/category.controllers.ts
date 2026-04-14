import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import HTTP_STATUS from '~/constants/httpStatus'
import { CATEGORY_MESSAGES } from '~/constants/messages'
import {
  CategoryIdReqParams,
  CreateCategoryReqBody,
  GetCategoriesQuery,
  UpdateCategoryReqBody
} from '~/models/requests/Category.requests'
import categoryService from '~/services/category.services'

export const getCategoriesController = async (
  req: Request<ParamsDictionary, any, any, GetCategoriesQuery>,
  res: Response
) => {
  // Mặc định chỉ trả isActive=true nếu không truyền param
  const isActiveParam = req.query.isActive
  const isActive = isActiveParam === undefined ? true : isActiveParam === 'true'

  const result = await categoryService.getCategories(isActive)
  res.status(HTTP_STATUS.OK).json({
    message: CATEGORY_MESSAGES.CATEGORIES_FETCHED,
    data: result
  })
}

export const createCategoryController = async (
  req: Request<ParamsDictionary, any, CreateCategoryReqBody>,
  res: Response
) => {
  const result = await categoryService.createCategory(req.body)
  res.status(HTTP_STATUS.CREATED).json({
    message: CATEGORY_MESSAGES.CATEGORY_CREATED,
    data: result
  })
}

export const updateCategoryController = async (
  req: Request<CategoryIdReqParams, any, UpdateCategoryReqBody>,
  res: Response
) => {
  const { id } = req.params
  const result = await categoryService.updateCategory(id, req.body)
  res.status(HTTP_STATUS.OK).json({
    message: CATEGORY_MESSAGES.CATEGORY_UPDATED,
    data: result
  })
}

export const deleteCategoryController = async (req: Request<CategoryIdReqParams>, res: Response) => {
  const { id } = req.params
  const result = await categoryService.softDeleteCategory(id)
  res.status(HTTP_STATUS.OK).json({
    message: CATEGORY_MESSAGES.CATEGORY_DELETED,
    data: result
  })
}
