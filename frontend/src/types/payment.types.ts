import { ApiResponse } from './api.types'
import { PAYMENT_METHOD, PAYMENT_STATUS } from '@/constants/enum'

export type PaymentMethod = (typeof PAYMENT_METHOD)[keyof typeof PAYMENT_METHOD]

export type PaymentStatus = (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS]

// POST /payments/process
export interface ProcessPaymentRequest {
  orderID: number
  paymentMethod: PaymentMethod
}

export interface ProcessPaymentResponseData {
  paymentID: number
  status: PaymentStatus
  transactionDate: string
}

export type ProcessPaymentResponse = ApiResponse<ProcessPaymentResponseData>
