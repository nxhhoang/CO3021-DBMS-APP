import { ParamsDictionary } from 'express-serve-static-core'

export interface DynamicAttributeInput {
  key: string
  label: string
  dataType: 'string' | 'number' | 'boolean'
  options?: string[]
}

export interface GetCategoriesQuery {
  isActive?: string
}

export interface CategoryIdReqParams extends ParamsDictionary {
  id: string
}

export interface CreateCategoryReqBody {
  name: string
  slug: string
  description?: string
  isActive?: boolean
  dynamicAttributes?: DynamicAttributeInput[]
  variantAttributes?: DynamicAttributeInput[]
}

export interface UpdateCategoryReqBody {
  name?: string
  slug?: string
  description?: string
  isActive?: boolean
  dynamicAttributes?: DynamicAttributeInput[]
  variantAttributes?: DynamicAttributeInput[]
}
