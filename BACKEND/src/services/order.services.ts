import { getClient, query } from '~/utils/postgres'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'
import { ORDER_MESSAGES } from '~/constants/messages'
import { CheckoutReqBody } from '~/models/requests/Order.requests'
import { OrderStatus, PaymentMethod, PaymentStatus } from '~/constants/enums'

export class OutOfStockError extends ErrorWithStatus {
  sku: string
  productId: string
  constructor(sku: string, productId: string) {
    super({ message: ORDER_MESSAGES.OUT_OF_STOCK, status: HTTP_STATUS.CONFLICT })
    this.sku = sku
    this.productId = productId
  }
}

class OrderService {
  //  Checkout — ACID Transaction
  //
  // Flow:
  //  1. BEGIN
  //  2. For each item: SELECT ... FOR UPDATE on inventories → check stock → deduct
  //  3. INSERT into orders → get order_id
  //  4. Bulk INSERT into items
  //  5. INSERT initial payment record
  //  6. COMMIT (or ROLLBACK on any failure)

  async checkout(userId: string, payload: CheckoutReqBody) {
    const { shippingAddressId, paymentMethod, items } = payload

    // Validate payment method
    const validMethods = Object.values(PaymentMethod) as string[]
    if (!validMethods.includes(paymentMethod)) {
      throw new ErrorWithStatus({ message: ORDER_MESSAGES.INVALID_PAYMENT_METHOD, status: HTTP_STATUS.BAD_REQUEST })
    }

    const client = await getClient()
    try {
      await client.query('BEGIN')

      let totalAmount = 0

      //  Step 2: Lock & validate inventory for each item
      for (const item of items) {
        const invResult = await client.query(
          `SELECT stockQuantity AS "stockQuantity" FROM INVENTORY WHERE sku = $1 FOR UPDATE`,
          [item.sku]
        )

        if (invResult.rows.length === 0 || invResult.rows[0].stockQuantity < item.quantity) {
          await client.query('ROLLBACK')
          throw new OutOfStockError(item.sku, item.productId)
        }

        // Deduct stock
        await client.query(
          `UPDATE INVENTORY SET stockQuantity = stockQuantity - $1, lastUpdated = NOW() WHERE sku = $2`,
          [item.quantity, item.sku]
        )

        // Use server-side unit price from request (BE2 will inject verified price here)
        totalAmount += item.unitPrice * item.quantity
      }

      //  Step 3: Create order
      //  Assuming the frontend sends a string for shippingAddressId, we will store it inside JSONB if shippingAddr requires JSONB,
      //  but since pg automatically converts object to JSONB, we wrap it in an object, or just pass it directly if it accepts string
      const shippingAddrObj = { id: shippingAddressId }

      const orderResult = await client.query(
        `INSERT INTO ORDERS (userID, shippingAddr, totalAmount, status)
         VALUES ($1, $2, $3, $4)
         RETURNING orderID AS "orderID"`,
        [userId, shippingAddrObj, totalAmount, OrderStatus.PENDING]
      )
      const orderId: number = orderResult.rows[0].orderID

      //  Step 4: Bulk insert items
      for (const item of items) {
        await client.query(
          `INSERT INTO ITEMS (orderID, productID, productName, sku, quantity, unitPrice)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [orderId, item.productId, item.productName, item.sku, item.quantity, item.unitPrice]
        )
      }

      //  Step 5: Create initial payment record
      await client.query(
        `INSERT INTO PAYMENTS (orderID, method, status)
         VALUES ($1, $2, $3)`,
        [orderId, paymentMethod, PaymentStatus.PENDING]
      )

      await client.query('COMMIT')

      return {
        orderID: orderId,
        totalAmount,
        status: OrderStatus.PENDING
      }
    } catch (err) {
      await client.query('ROLLBACK')
      throw err
    } finally {
      client.release()
    }
  }

  //  Get order list for a user

  async getOrders(userId: string) {
    const result = await query(
      `SELECT orderID AS "orderID", status, totalAmount AS "totalAmount", createdAt AS "createdAt"
       FROM ORDERS
       WHERE userID = $1
       ORDER BY createdAt DESC`,
      [userId]
    )
    return result.rows
  }

  //  Get single order detail

  async getOrderById(orderId: number, userId: string) {
    const orderResult = await query(
      `SELECT orderID AS "orderID", status, totalAmount AS "totalAmount", createdAt AS "createdAt"
       FROM ORDERS
       WHERE orderID = $1 AND userID = $2`,
      [orderId, userId]
    )

    if (orderResult.rows.length === 0) {
      throw new ErrorWithStatus({ message: ORDER_MESSAGES.ORDER_NOT_FOUND, status: HTTP_STATUS.NOT_FOUND })
    }

    const itemsResult = await query(
      `SELECT productID AS "productId", productName AS "productName", sku, quantity, unitPrice AS "unitPrice"
       FROM ITEMS WHERE orderID = $1`,
      [orderId]
    )

    const paymentResult = await query(`SELECT method, status FROM PAYMENTS WHERE orderID = $1 LIMIT 1`, [orderId])

    return {
      ...orderResult.rows[0],
      items: itemsResult.rows,
      payment: paymentResult.rows[0] || null
    }
  }

  //  Admin: Update order status

  async updateOrderStatus(orderId: number, newStatus: OrderStatus) {
    const validStatuses = Object.values(OrderStatus) as string[]
    if (!validStatuses.includes(newStatus)) {
      throw new ErrorWithStatus({ message: ORDER_MESSAGES.INVALID_ORDER_STATUS, status: HTTP_STATUS.BAD_REQUEST })
    }

    const result = await query(
      `UPDATE ORDERS SET status = $1
       WHERE orderID = $2
       RETURNING orderID AS "orderID", status`,
      [newStatus, orderId]
    )

    if (result.rows.length === 0) {
      throw new ErrorWithStatus({ message: ORDER_MESSAGES.ORDER_NOT_FOUND, status: HTTP_STATUS.NOT_FOUND })
    }

    // When DELIVERED → call BE2 stub to update total_sold in MongoDB
    // BE2 will provide: updateTotalSold(productIds: { productId: string; quantity: number }[])
    if (newStatus === OrderStatus.DELIVERED) {
      // TODO: import & call BE2's updateTotalSold when available
    }

    return result.rows[0]
  }

  // Admin: Get all orders with pagination
  async getAllOrdersAdmin(limit: number = 10, page: number = 1) {
    const offset = (page - 1) * limit

    // 1. Lấy danh sách orders kèm thông tin User (nếu cần)
    // Tôi sử dụng "userid" thay vì "userID" dựa trên lỗi database trước đó của bạn
    const result = await query(
      `SELECT 
        orderid AS "orderID", 
        userid AS "userID", 
        status, 
        totalamount AS "totalAmount", 
        createdat AS "createdAt",
        shippingaddr AS "shippingAddr"
       FROM ORDERS
       ORDER BY createdat DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    )

    // 2. Lấy tổng số lượng để Frontend làm phân trang
    const countResult = await query(`SELECT COUNT(*) FROM ORDERS`)
    const totalOrders = parseInt(countResult.rows[0].count)

    return {
      orders: result.rows,
      pagination: {
        total: totalOrders,
        page,
        limit,
        totalPages: Math.ceil(totalOrders / limit)
      }
    }
  }
}

const orderService = new OrderService()
export default orderService

