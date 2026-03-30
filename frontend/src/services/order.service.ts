import { api, privateApi } from '../lib/axios';
import { CreateOrderRequest, CreateOrderResponse } from '@/types';

export const orderService = {
  async createOrder(data: CreateOrderRequest) {
    const res = await privateApi.post<CreateOrderResponse>(`orders`, data);
    return res.data;
  },
};

// Example for createOrder in console:
// privateApi.post('orders', {
//   shippingAddressId: '1',
//   paymentMethod: 'COD',
//   items: [
//     {
//       productID: 'product-1',
//       productName: 'MacBook',
//       sku: 'MBP-M3-16-512',
//       quantity: 1,
//       unitPrice: 10000,
//     },
//   ],
// });
