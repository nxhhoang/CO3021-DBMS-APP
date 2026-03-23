import pool from '~/utils/postgres'
import { CreateInventoryReqBody } from '~/models/requests/Inventory.requests'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'
import { INVENTORY_MESSAGES } from '~/constants/messages'

class InventoryService {
  async createInventory(body: CreateInventoryReqBody) {
    const { product_id, sku, stock_quantity } = body

    try {
      const result = await pool.query(
        `INSERT INTO inventories (product_id, sku, stock_quantity) 
         VALUES ($1, $2, $3) RETURNING *`,
        [product_id, sku, stock_quantity]
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

  async updateInventoryQuantity(inventoryId: string, quantity: number) {
    const result = await pool.query(
      `UPDATE inventories 
       SET stock_quantity = $1, updated_at = NOW() 
       WHERE inventory_id = $2 RETURNING *`,
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
      `SELECT * FROM inventories WHERE product_id = $1`,
      [productId]
    )
    return result.rows
  }

  async getInventoriesBySku(sku: string) {
    const result = await pool.query(
      `SELECT * FROM inventories WHERE sku = $1`,
      [sku]
    )
    return result.rows
  }
}

const inventoryService = new InventoryService()
export default inventoryService
