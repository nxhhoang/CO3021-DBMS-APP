import { ObjectId } from 'mongodb'
import { CATEGORY_MESSAGES } from '~/constants/messages'
import Category from '~/models/schemas/Category.schema'
import { CreateCategoryReqBody, UpdateCategoryReqBody } from '~/models/requests/Category.requests'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'
import { getMongoDB } from '~/utils/mongodb'

class CategoryService {
  private get collection() {
    return getMongoDB().collection<Category>('categories')
  }

  async getCategories(isActive?: boolean) {
    const filter = isActive !== undefined ? { isActive } : {}
    return await this.collection.find(filter).toArray()
  }

  async getCategoryById(id: string) {
    const category = await this.collection.findOne({ _id: new ObjectId(id) })
    if (!category) {
      throw new ErrorWithStatus({
        message: CATEGORY_MESSAGES.CATEGORY_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }
    return category
  }

  async createCategory(body: CreateCategoryReqBody) {
    const existingSlug = await this.collection.findOne({ slug: body.slug })
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

    const result = await this.collection.insertOne(newCategory)
    return { _id: result.insertedId }
  }

  async updateCategory(id: string, body: UpdateCategoryReqBody) {
    // Check if category exists
    const existing = await this.getCategoryById(id)

    if (body.slug && body.slug !== existing.slug) {
      const slugConflict = await this.collection.findOne({
        slug: body.slug,
        _id: { $ne: new ObjectId(id) }
      })
      if (slugConflict) {
        throw new ErrorWithStatus({
          message: CATEGORY_MESSAGES.CATEGORY_SLUG_ALREADY_EXISTS,
          status: HTTP_STATUS.CONFLICT
        })
      }
    }

    const updateData: Partial<Category> = {
      updated_at: new Date()
    }

    if (body.name !== undefined) updateData.name = body.name
    if (body.slug !== undefined) updateData.slug = body.slug
    if (body.description !== undefined) updateData.description = body.description
    if (body.isActive !== undefined) updateData.isActive = body.isActive
    if (body.dynamicAttributes !== undefined) {
      updateData.dynamicAttributes = body.dynamicAttributes.map((attr) => ({
        ...attr,
        options: attr.options ?? []
      }))
    }

    const updated = await this.collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    )

    if (!updated) {
      throw new ErrorWithStatus({
        message: CATEGORY_MESSAGES.CATEGORY_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    return { _id: updated._id, name: updated.name, isActive: updated.isActive }
  }

  async softDeleteCategory(id: string) {
    const updated = await this.collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { isActive: false, updated_at: new Date() } },
      { returnDocument: 'after' }
    )

    if (!updated) {
      throw new ErrorWithStatus({
        message: CATEGORY_MESSAGES.CATEGORY_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    return { _id: updated._id, isActive: false }
  }

  async checkCategoryExists(id: string): Promise<boolean> {
    const count = await this.collection.countDocuments({ _id: new ObjectId(id), isActive: true })
    return count > 0
  }
}

const categoryService = new CategoryService()
export default categoryService
