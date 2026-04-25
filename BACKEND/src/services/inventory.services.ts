import pool from '~/utils/postgres'
import { CreateInventoryReqBody } from '~/models/requests/Inventory.requests'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'
import { INVENTORY_MESSAGES, SKU_MESSAGES, PRODUCT_MESSAGES } from '~/constants/messages'
import { getMongoDB } from '~/utils/mongodb'
import { ObjectId } from 'mongodb'
import SKU from '~/models/schemas/SKU.schema'
import { CreateSkuReqBody } from '~/models/requests/Inventory.requests'

class InventoryService {
  async createInventory(body: CreateInventoryReqBody) {
    const { productID, sku, stockQuantity } = body

    try {
      const result = await pool.query(
        `INSERT INTO INVENTORY (productID, sku, stockQuantity) 
         VALUES ($1, $2, $3) RETURNING *`,
        [productID, sku, stockQuantity]
      )
      return result.rows[0]
    } catch (error: any) {
      if (error.code === '23505') { // Unique violation Postgres Error Code
        throw new ErrorWithStatus({
          message: INVENTORY_MESSAGES.INVENTORY_SKU_ALREADY_EXISTS,
          status: HTTP_STATUS.CONFLICT
        })
      }
      throw error
    }
  }

  async deleteSkusByProductId(productId: string) {
    // 1. Delete from PostgreSQL
    await pool.query('DELETE FROM INVENTORY WHERE productID = $1', [productId])

    // 2. Delete from MongoDB
    await getMongoDB()
      .collection('skus')
      .deleteMany({ productID: new ObjectId(productId) })
  }

  async updateInventoryQuantity(inventoryId: string, quantity: number) {
    const result = await pool.query(
      `UPDATE INVENTORY 
       SET stockQuantity = $1, updated_at = NOW() 
       WHERE inventoryID = $2 RETURNING *`,
      [quantity, inventoryId]
    )
    if (result.rows.length === 0) {
      throw new ErrorWithStatus({
        message: INVENTORY_MESSAGES.INVENTORY_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }
    return result.rows[0]
  }

  async getInventoriesByProductId(productId: string) {
    const result = await pool.query(
      `SELECT * FROM INVENTORY WHERE productID = $1`,
      [productId]
    )
    return result.rows
  }

  async getInventoriesBySku(sku: string) {
    const result = await pool.query(
      `SELECT * FROM INVENTORY WHERE sku = $1`,
      [sku]
    )
    return result.rows
  }

  // ── Combined SKU & Inventory (Mongo + Postgres) ─────────────────────────────

  async createSku(body: CreateSkuReqBody) {
    const { productID, sku, skuPrice, attributes, stockQuantity } = body

    // 1. Validate attributes against Category variantAttributes
    const product = await getMongoDB()
      .collection('products')
      .findOne({ _id: new ObjectId(productID) })
    if (!product) {
      throw new ErrorWithStatus({
        message: PRODUCT_MESSAGES.PRODUCT_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    const category = await getMongoDB()
      .collection('categories')
      .findOne({ _id: product.categoryID })
    if (category) {
      const validVariantKeys = category.variantAttributes?.map((attr: any) => attr.key) || []
      const inputKeys = Object.keys(attributes || {})

      // Check for invalid attributes
      const invalidKeys = inputKeys.filter((key) => !validVariantKeys.includes(key))
      if (invalidKeys.length > 0) {
        throw new ErrorWithStatus({
          message: `Invalid attributes for this category: ${invalidKeys.join(', ')}`,
          status: HTTP_STATUS.UNPROCESSABLE_ENTITY
        })
      }

      // Optional: Check if all required variant attributes are provided
      const missingKeys = validVariantKeys.filter((key: string) => !inputKeys.includes(key))
      if (missingKeys.length > 0) {
        throw new ErrorWithStatus({
          message: `Missing required variant attributes: ${missingKeys.join(', ')}`,
          status: HTTP_STATUS.UNPROCESSABLE_ENTITY
        })
      }
    }

    // 2. Check if SKU already exists in MongoDB to prevent duplicates before PG insert
    const existingSku = await getMongoDB().collection('skus').findOne({ sku })
    if (existingSku) {
      throw new ErrorWithStatus({
        message: INVENTORY_MESSAGES.INVENTORY_SKU_ALREADY_EXISTS,
        status: HTTP_STATUS.CONFLICT
      })
    }

    // 3. Create SKU in MongoDB
    const mongoSku = new SKU({
      sku,
      skuPrice,
      productID: new ObjectId(productID),
      attributes: attributes || {}
    })

    const mongoResult = await getMongoDB().collection('skus').insertOne(mongoSku)

    // 4. Create Inventory in PostgreSQL
    try {
      const pgResult = await pool.query(
        `INSERT INTO INVENTORY (productID, sku, stockQuantity) 
         VALUES ($1, $2, $3) RETURNING *`,
        [productID, sku, stockQuantity]
      )

      return {
        _id: mongoResult.insertedId,
        sku,
        skuPrice,
        attributes,
        inventory: pgResult.rows[0]
      }
    } catch (error: any) {
      // Cleanup Mongo if PG fails (Manual Rollback)
      await getMongoDB().collection('skus').deleteOne({ _id: mongoResult.insertedId })

      if (error.code === '23505') {
        throw new ErrorWithStatus({
          message: INVENTORY_MESSAGES.INVENTORY_SKU_ALREADY_EXISTS,
          status: HTTP_STATUS.CONFLICT
        })
      }
      throw error
    }
  }
}

const inventoryService = new InventoryService()
export default inventoryService
