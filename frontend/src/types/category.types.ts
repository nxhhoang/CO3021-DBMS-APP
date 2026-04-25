import { ApiResponse } from './api.types'

export interface DynamicAttribute {
  key: string
  label: string
  dataType: 'string' | 'number' | 'boolean'
  options: string[]
}

export interface DynamicAttributeInput {
  key: string
  label: string
  dataType: 'string' | 'number' | 'boolean'
  options?: string[]
}

export interface Category {
  _id: string
  ID?: string
  name: string
  slug: string
  description: string
  isActive: boolean
  dynamicAttributes: DynamicAttribute[]
  variantAttributes?: DynamicAttribute[]
  createdAt?: string
  updatedAt?: string
}

// GET /categories
export type GetCategoriesRequest = { isActive?: boolean }
export type GetCategoriesResponse = ApiResponse<Category[]>

// POST /admin/categories
export interface CreateCategoryRequest {
  name: string
  slug: string
  description?: string
  isActive?: boolean
  dynamicAttributes?: DynamicAttributeInput[]
  variantAttributes?: DynamicAttributeInput[]
}
export type CreateCategoryResponse = ApiResponse<{ _id: string }>

// PUT /admin/categories/:id
export type UpdateCategoryRequest = Partial<CreateCategoryRequest>
export type UpdateCategoryResponse = ApiResponse<{
  _id: string
  name: string
  isActive: boolean
}>

// DELETE /admin/categories/:id
export type DeleteCategoryResponse = ApiResponse<{
  _id: string
  isActive: boolean
}>
