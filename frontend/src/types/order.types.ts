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

// // GET /admin/orders
// export type GetAdminOrdersResponse = ApiResponse<Order[]>;

//PUT /admin/orders/:orderId/status
export type UpdateOrderStatusRequest = { status: OrderStatus };
export type UpdateOrderStatusResponse = ApiResponse<
  Pick<Order, 'orderID' | 'status'> & { updatedAt: string }
>;

// Định nghĩa cấu trúc phân trang trả về từ Backend
export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Cập nhật lại Order để khớp với dữ liệu Admin (có thêm userID)
export interface AdminOrder extends Order {
  userID: string;
  shippingAddr?: any; // Bạn có thể định nghĩa interface cụ thể cho địa chỉ nếu cần
}

// Cập nhật Response cho Admin: Data bây giờ là một object chứa list và pagination
export type GetAdminOrdersResponse = ApiResponse<{
  orders: AdminOrder[];
  pagination: Pagination;
}>;

// Params khi gọi API (Query string)
export interface GetAdminOrdersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sort?: string;
}