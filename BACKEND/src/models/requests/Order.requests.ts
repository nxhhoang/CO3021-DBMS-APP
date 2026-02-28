import { ParamsDictionary } from 'express-serve-static-core'

export interface CartItem {
  productId: string
  sku: string
  quantity: number
}

export interface SyncCartReqBody {
  items: CartItem[]
}

export interface OrderItem extends CartItem {
  productName: string
  unitPrice: number
}

export interface CheckoutReqBody {
  shippingAddressId: number
  paymentMethod: string
  items: OrderItem[]
}

export interface OrderReqParams extends ParamsDictionary {
  orderId: string
}
