import { http, HttpResponse } from 'msw';
import {
  SyncCartRequest,
  SyncCartResponse,
  CartItem,
} from '@/types/cart.types';
import { BASE_URL } from '@/constants/api';
import { MOCK_CART } from '../data/cart';
import { MOCK_PRODUCTS, MOCK_PRODUCT_DETAILS } from '../data/products';

export const cartHandlers = [
  http.post(`${BASE_URL}/cart/sync`, async ({ request }) => {
    const body = (await request.json()) as SyncCartRequest;

    const merged: CartItem[] = [...MOCK_CART.items];

    for (const reqItem of body.items) {
      const existing = merged.find((i) => i.sku === reqItem.sku);

      // lấy product info
      const product = MOCK_PRODUCTS.find((p) => p._id === reqItem.productID);

      if (!product) continue;

      const productDetail = MOCK_PRODUCT_DETAILS[product._id];

      const inventory = productDetail?.inventory.find(
        (inv) => inv.sku === reqItem.sku,
      );

      const stockQuantity = inventory?.stockQuantity ?? 0;

      if (existing) {
        existing.quantity += reqItem.quantity;
      } else {
        merged.push({
          productID: product._id,
          sku: reqItem.sku,
          quantity: reqItem.quantity,
          productName: product.name,
          image: product.images[0],
          stockQuantity: stockQuantity,
          unitPrice: product.base_price,
        });
      }
    }

    const response: SyncCartResponse = {
      message: 'Đồng bộ giỏ hàng thành công',
      data: {
        cartTotal: merged.reduce((t, i) => t + i.quantity, 0),
        items: merged,
      },
    };
    MOCK_CART.items = merged;

    return HttpResponse.json(response);
  }),

  // PUT /cart/items/:sku
  http.put(`${BASE_URL}/cart/items/:sku`, async ({ request, params }) => {
    const { sku } = params;

    const body = (await request.json()) as {
      quantity?: number;
      newSku?: string;
    };

    const item = MOCK_CART.items.find((i) => i.sku === sku);

    if (!item) {
      return HttpResponse.json(
        { message: 'Sản phẩm không tồn tại trong giỏ hàng' },
        { status: 404 },
      );
    }

    // đổi SKU
    if (body.newSku && body.newSku !== sku) {
      const existing = MOCK_CART.items.find((i) => i.sku === body.newSku);

      if (existing) {
        // merge quantity
        existing.quantity += body.quantity ?? item.quantity;

        // remove item cũ
        MOCK_CART.items = MOCK_CART.items.filter((i) => i.sku !== sku);
      } else {
        item.sku = body.newSku;

        if (body.quantity !== undefined) {
          item.quantity = body.quantity;
        }
      }
    }

    // chỉ update quantity
    else if (body.quantity !== undefined) {
      item.quantity = body.quantity;
    }

    return HttpResponse.json({
      message: 'Cập nhật giỏ hàng thành công',
      data: null,
    });
  }),
  // DELETE /cart/items/:sku
  http.delete(`${BASE_URL}/cart/items/:sku`, async ({ params }) => {
    const { sku } = params;

    const index = MOCK_CART.items.findIndex((i) => i.sku === sku);

    if (index === -1) {
      return HttpResponse.json(
        { message: 'Sản phẩm không tồn tại trong giỏ hàng' },
        { status: 404 },
      );
    }

    // xóa item
    MOCK_CART.items.splice(index, 1);

    return HttpResponse.json({
      message: 'Xóa sản phẩm khỏi giỏ hàng thành công',
      data: null,
    });
  }),
];
