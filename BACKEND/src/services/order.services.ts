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
  //  4. Bulk INSERT into order_items
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
        const invResult = await client.query(`SELECT stock_quantity FROM inventories WHERE sku = $1 FOR UPDATE`, [
          item.sku
        ])

        if (invResult.rows.length === 0 || invResult.rows[0].stock_quantity < item.quantity) {
          await client.query('ROLLBACK')
          throw new OutOfStockError(item.sku, item.productId)
        }

        // Deduct stock
        await client.query(
          `UPDATE inventories SET stock_quantity = stock_quantity - $1, updated_at = NOW() WHERE sku = $2`,
          [item.quantity, item.sku]
        )

        // Use server-side unit price from request (BE2 will inject verified price here)
        totalAmount += item.unitPrice * item.quantity
      }

      //  Step 3: Create order
      const orderResult = await client.query(
        `INSERT INTO orders (user_id, shipping_address_id, total_amount, status)
         VALUES ($1, $2, $3, $4)
         RETURNING order_id`,
        [userId, shippingAddressId, totalAmount, OrderStatus.PENDING]
      )
      const orderId: number = orderResult.rows[0].order_id

      //  Step 4: Bulk insert order_items
      for (const item of items) {
        await client.query(
          `INSERT INTO order_items (order_id, product_id, product_name, sku, quantity, unit_price)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [orderId, item.productId, item.productName, item.sku, item.quantity, item.unitPrice]
        )
      }

      //  Step 5: Create initial payment record
      await client.query(
        `INSERT INTO payments (order_id, method, status)
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
      `SELECT order_id AS "orderID", status, total_amount AS "totalAmount", created_at AS "createdAt"
       FROM orders
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    )
    return result.rows
  }

  //  Get single order detail

  async getOrderById(orderId: number, userId: string) {
    const orderResult = await query(
      `SELECT order_id AS "orderID", status, total_amount AS "totalAmount", created_at AS "createdAt"
       FROM orders
       WHERE order_id = $1 AND user_id = $2`,
      [orderId, userId]
    )

    if (orderResult.rows.length === 0) {
      throw new ErrorWithStatus({ message: ORDER_MESSAGES.ORDER_NOT_FOUND, status: HTTP_STATUS.NOT_FOUND })
    }

    const itemsResult = await query(
      `SELECT product_id AS "productId", product_name AS "productName", sku, quantity, unit_price AS "unitPrice"
       FROM order_items WHERE order_id = $1`,
      [orderId]
    )

    const paymentResult = await query(`SELECT method, status FROM payments WHERE order_id = $1 LIMIT 1`, [orderId])

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
      `UPDATE orders SET status = $1, updated_at = NOW()
       WHERE order_id = $2
       RETURNING order_id AS "orderID", status, updated_at AS "updatedAt"`,
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
}

const orderService = new OrderService()
export default orderService
