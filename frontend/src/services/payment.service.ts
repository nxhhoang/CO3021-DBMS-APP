import { privateApi } from '../lib/axios'
import { ProcessPaymentRequest, ProcessPaymentResponse } from '@/types'

export const paymentService = {
  async processPayment(data: ProcessPaymentRequest) {
    const res = await privateApi.post<ProcessPaymentResponse>(`payments/process`, data)
    return res.data
  }
}
