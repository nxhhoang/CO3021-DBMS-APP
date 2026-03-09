import { ApiResponse } from './api.types';

export interface DynamicAttribute {
  key: string;
  label: string;
  dataType: 'string' | 'number' | 'boolean';
  isRequired: boolean;
  options: string[];
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  dynamicAttributes: DynamicAttribute[];
}

// GET /categories
export type GetCategoriesRequest = { isActive?: boolean };
export type GetCategoriesResponse = ApiResponse<Category[]>;

// POST /admin/categories
export type CreateCategoryRequest = Omit<Category, '_id'>;
export type CreateCategoryResponse = ApiResponse<{ _id: string }>;
