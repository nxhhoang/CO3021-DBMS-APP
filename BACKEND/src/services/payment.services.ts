import { query } from '~/utils/postgres'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'
import { PAYMENT_MESSAGES } from '~/constants/messages'
import { PaymentStatus, OrderStatus } from '~/constants/enums'

class PaymentService {
  /**
   * Process / confirm a payment for an order.
   * Updates payments.status → COMPLETED and orders.status → PROCESSING.
   */
  async processPayment(orderID: number, paymentMethod: string) {
    // Verify order exists and is still PENDING
    const orderCheck = await query(`SELECT order_id FROM orders WHERE order_id = $1 AND status = $2`, [
      orderID,
      OrderStatus.PENDING
    ])
    if (orderCheck.rows.length === 0) {
      throw new ErrorWithStatus({ message: PAYMENT_MESSAGES.ORDER_ALREADY_PAID, status: HTTP_STATUS.BAD_REQUEST })
    }

    // Update payment record
    const payResult = await query(
      `UPDATE payments
         SET status = $1, method = $2, transaction_date = NOW()
       WHERE order_id = $3
       RETURNING payment_id AS "paymentID", status, transaction_date AS "transactionDate"`,
      [PaymentStatus.COMPLETED, paymentMethod, orderID]
    )

    if (payResult.rows.length === 0) {
      throw new ErrorWithStatus({ message: PAYMENT_MESSAGES.PAYMENT_NOT_FOUND, status: HTTP_STATUS.NOT_FOUND })
    }

    // Advance order status to PROCESSING
    await query(`UPDATE orders SET status = $1, updated_at = NOW() WHERE order_id = $2`, [
      OrderStatus.PROCESSING,
      orderID
    ])

    return payResult.rows[0]
  }
}

const paymentService = new PaymentService()
export default paymentService
