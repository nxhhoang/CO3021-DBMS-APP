import { ObjectId } from 'mongodb'

export interface DynamicAttribute {
  key: string
  label: string
  dataType: 'string' | 'number' | 'boolean'
  isRequired: boolean
  options: string[]
}

interface CategoryType {
  _id?: ObjectId
  name: string
  slug: string
  description?: string
  isActive?: boolean
  dynamicAttributes?: DynamicAttribute[]
  variantAttributes?: DynamicAttribute[]
  created_at?: Date
  updated_at?: Date
}

export default class Category {
  _id: ObjectId
  name: string
  slug: string
  description: string
  isActive: boolean
  dynamicAttributes: DynamicAttribute[]
  variantAttributes: DynamicAttribute[]
  created_at: Date
  updated_at: Date

  constructor(category: CategoryType) {
    const date = new Date()
    this._id = category._id || new ObjectId()
    this.name = category.name
    this.slug = category.slug
    this.description = category.description || ''
    this.isActive = category.isActive !== undefined ? category.isActive : true
    this.dynamicAttributes = category.dynamicAttributes || []
    this.variantAttributes = category.variantAttributes || []
    this.created_at = category.created_at || date
    this.updated_at = category.updated_at || date
  }
}
