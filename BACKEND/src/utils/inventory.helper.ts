import { query } from '~/utils/postgres'

/**
 * BE1 helper for BE2 to use in the Hybrid Product Detail API.
 *
 * Returns the inventory (sku + stockQuantity) for all SKUs
 * that belong to a given MongoDB product ID.
 *
 * BE2 calls: getStockByMongoId(mongoProductId)
 * and merges the result into the product detail response.
 */
export const getStockByMongoId = async (mongoProductId: string) => {
  const result = await query(
    `SELECT sku, stock_quantity AS "stockQuantity"
     FROM inventories
     WHERE product_id = $1`,
    [mongoProductId]
  )
  return result.rows // [{ sku: 'M3-16-512', stockQuantity: 50 }, ...]
}

/**
 * Check and lock inventory for a single SKU inside an existing transaction.
 * Used by BE1 checkout, but exposed so BE2 can also use it if needed.
 * Must be called within a BEGIN/COMMIT block (provide a PoolClient).
 */
export const getStockBySku = async (sku: string) => {
  const result = await query(
    `SELECT sku, stock_quantity AS "stockQuantity"
     FROM inventories
     WHERE sku = $1`,
    [sku]
  )
  return result.rows[0] || null
}
