import mockInventory, { InventoryItem } from '~/models/data/inventory.data'
import { INVENTORY_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'

/**
 * InsufficientStockError — được throw khi kho không đủ hàng.
 * BE1 bắt lỗi này để rollback transaction và trả 400 cho client.
 */
export class InsufficientStockError extends ErrorWithStatus {
  sku: string
  requested: number
  available: number

  constructor(sku: string, requested: number, available: number) {
    super({ message: INVENTORY_MESSAGES.INSUFFICIENT_STOCK, status: HTTP_STATUS.BAD_REQUEST })
    this.sku = sku
    this.requested = requested
    this.available = available
  }
}

interface OrderItem {
  sku: string
  quantity: number
}

class InventoryService {
  // In-memory inventory — thay bằng PostgreSQL query khi kết nối thật
  private inventory: InventoryItem[] = mockInventory

  private findBySku(sku: string): InventoryItem | undefined {
    return this.inventory.find((item) => item.sku === sku)
  }

  getInventoryByProductId(productId: string): InventoryItem[] {
    return this.inventory.filter((item) => item.product_id === productId)
  }

  checkStock(items: OrderItem[]): void {
    for (const { sku, quantity } of items) {
      const record = this.findBySku(sku)
      if (!record) {
        throw new ErrorWithStatus({
          message: `${INVENTORY_MESSAGES.INVENTORY_NOT_FOUND}: SKU ${sku}`,
          status: HTTP_STATUS.NOT_FOUND
        })
      }
      if (record.stock_quantity < quantity) {
        throw new InsufficientStockError(sku, quantity, record.stock_quantity)
      }
    }
  }

  /**
   * checkAndDecreaseStock — hàm nguyên tử được gọi bên trong
   * PostgreSQL transaction của BE1.
   *
   * Trong mock: kiểm tra và trừ kho in-memory.
   * Trong production: nhận PoolClient từ BE1 và thực hiện
   *   SELECT ... FOR UPDATE rồi UPDATE trực tiếp trên DB.
   *
   * @param items  Danh sách { sku, quantity } cần trừ kho
   */
  async checkAndDecreaseStock(items: OrderItem[]): Promise<void> {
    // Phase 1: kiểm tra tất cả trước khi trừ (tránh partial decrease)
    this.checkStock(items)

    // Phase 2: thực hiện trừ kho
    for (const { sku, quantity } of items) {
      const record = this.findBySku(sku)!
      record.stock_quantity -= quantity
      record.updated_at = new Date()
    }
  }

  async increaseStock(items: OrderItem[]): Promise<void> {
    for (const { sku, quantity } of items) {
      const record = this.findBySku(sku)
      if (record) {
        record.stock_quantity += quantity
        record.updated_at = new Date()
      }
    }
  }
}

const inventoryService = new InventoryService()
export { inventoryService }
export default inventoryService
