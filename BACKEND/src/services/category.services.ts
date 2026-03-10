import { ObjectId } from 'mongodb'
import { CATEGORY_MESSAGES } from '~/constants/messages'
import Category from '~/models/schemas/Category.schema'
import mockCategories from '~/models/data/categories.data'
import { CreateCategoryReqBody, UpdateCategoryReqBody } from '~/models/requests/Category.requests'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'

class CategoryService {
  // In-memory store — thay bằng MongoDB collection khi kết nối thật
  private categories: Category[] = mockCategories

  async getCategories(isActive?: boolean) {
    if (isActive === undefined) {
      return this.categories
    }
    return this.categories.filter((cat) => cat.isActive === isActive)
  }

  async getCategoryById(id: string) {
    const category = this.categories.find((cat) => cat._id.toHexString() === id)
    if (!category) {
      throw new ErrorWithStatus({
        message: CATEGORY_MESSAGES.CATEGORY_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }
    return category
  }

  async createCategory(body: CreateCategoryReqBody) {
    // Kiểm tra slug đã tồn tại chưa
    const existingSlug = this.categories.find((cat) => cat.slug === body.slug)
    if (existingSlug) {
      throw new ErrorWithStatus({
        message: CATEGORY_MESSAGES.CATEGORY_SLUG_ALREADY_EXISTS,
        status: HTTP_STATUS.CONFLICT
      })
    }

    const newCategory = new Category({
      ...body,
      dynamicAttributes: body.dynamicAttributes?.map((attr) => ({
        ...attr,
        options: attr.options ?? []
      }))
    })

    this.categories.push(newCategory)
    return { _id: newCategory._id }
  }

  async updateCategory(id: string, body: UpdateCategoryReqBody) {
    const index = this.categories.findIndex((cat) => cat._id.toHexString() === id)
    if (index === -1) {
      throw new ErrorWithStatus({
        message: CATEGORY_MESSAGES.CATEGORY_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    // Kiểm tra slug mới có trùng với category khác không
    if (body.slug) {
      const slugConflict = this.categories.find(
        (cat) => cat.slug === body.slug && cat._id.toHexString() !== id
      )
      if (slugConflict) {
        throw new ErrorWithStatus({
          message: CATEGORY_MESSAGES.CATEGORY_SLUG_ALREADY_EXISTS,
          status: HTTP_STATUS.CONFLICT
        })
      }
    }

    const existing = this.categories[index]
    const updated = new Category({
      _id: existing._id,
      name: body.name ?? existing.name,
      slug: body.slug ?? existing.slug,
      description: body.description ?? existing.description,
      isActive: body.isActive ?? existing.isActive,
      dynamicAttributes:
        body.dynamicAttributes !== undefined
          ? body.dynamicAttributes.map((attr) => ({ ...attr, options: attr.options ?? [] }))
          : existing.dynamicAttributes,
      created_at: existing.created_at,
      updated_at: new Date()
    })

    this.categories[index] = updated
    return { _id: updated._id, name: updated.name, isActive: updated.isActive }
  }

  async softDeleteCategory(id: string) {
    const index = this.categories.findIndex((cat) => cat._id.toHexString() === id)
    if (index === -1) {
      throw new ErrorWithStatus({
        message: CATEGORY_MESSAGES.CATEGORY_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    this.categories[index].isActive = false
    this.categories[index].updated_at = new Date()

    return { _id: this.categories[index]._id, isActive: false }
  }

  // Helper dùng nội bộ (ví dụ: product service validate categoryId)
  async checkCategoryExists(id: string): Promise<boolean> {
    return this.categories.some((cat) => cat._id.toHexString() === id && cat.isActive)
  }
}

const categoryService = new CategoryService()
export default categoryService
