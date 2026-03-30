import { ApiResponse } from './api.types';
import { ORDER_STATUS } from '@/constants/enum';

export type OrderStatus = keyof typeof ORDER_STATUS;

export interface OrderItem {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  orderID: number;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
}

export interface OrderDetail extends Order {
  items: OrderItem[];
  payment: {
    status: OrderStatus;
    method: string;
  };
}

// POST /orders
export interface CreateOrderRequest {
  shippingAddressId: number;
  paymentMethod: string;
  items: OrderItem[];
}

export type CreateOrderResponse = ApiResponse<{
  orderID: number;
  totalAmount: number;
  status: OrderStatus;
}>;

// GET /orders
export type GetOrdersResponse = ApiResponse<Order[]>;

// GET /orders/:orderId
export type GetOrderDetailRequest = { orderId: number };
export type GetOrderDetailResponse = ApiResponse<OrderDetail>;

//PUT /admin/orders/:orderId/status
export type UpdateOrderStatusRequest = { status: OrderStatus };
export type UpdateOrderStatusResponse = ApiResponse<
  Pick<Order, 'orderID' | 'status'> & { updatedAt: string }
>;
