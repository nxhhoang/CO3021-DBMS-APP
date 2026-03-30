import { http, HttpResponse } from 'msw';
import {
  SyncCartRequest,
  SyncCartResponse,
  CartItem,
} from '@/types/cart.types';
import { BASE_URL } from '@/constants/api';
import { MOCK_CART } from '../data/cart';
import { MOCK_PRODUCTS } from '../data/products';
import { MOCK_INVENTORY } from '../data/inventory'; // Giả định file inventory chứa MOCK_INVENTORY

export const cartHandlers = [
  // POST /cart/sync
  http.post(`${BASE_URL}/cart/sync`, async ({ request }) => {
    const body = (await request.json()) as SyncCartRequest;

    // Tạo bản sao để xử lý merged
    const merged: CartItem[] = [...MOCK_CART.items];

    for (const reqItem of body.items) {
      // 1. Tìm thông tin sản phẩm (Mongo Logic)
      const product = MOCK_PRODUCTS.find((p) => p._id === reqItem.productID);
      if (!product) continue;

      // 2. Tìm thông tin tồn kho và giá biến thể (Postgres Logic)
      const inventory = MOCK_INVENTORY.find((inv) => inv.sku === reqItem.sku);
      if (!inventory) continue;

      const existing = merged.find((i) => i.sku === reqItem.sku);

      if (existing) {
        // Cập nhật số lượng và đồng bộ giá mới nhất
        existing.quantity += reqItem.quantity;
        existing.unitPrice = inventory.sku_price;
        existing.stockQuantity = inventory.stockQuantity;
      } else {
        // Thêm mới item vào giỏ hàng
        merged.push({
          productID: product._id,
          sku: reqItem.sku,
          quantity: reqItem.quantity,
          productName: product.name,
          image: product.images[0],
          stockQuantity: inventory.stockQuantity,
          unitPrice: inventory.sku_price, // Lấy giá của SKU thay vì basePrice
        });
      }
    }

    const response: SyncCartResponse = {
      message: 'Đồng bộ giỏ hàng thành công',
      data: {
        cartTotal: merged.reduce(
          (total, item) => total + item.unitPrice * item.quantity,
          0,
        ),
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

    const itemIndex = MOCK_CART.items.findIndex((i) => i.sku === sku);

    if (itemIndex === -1) {
      return HttpResponse.json(
        { message: 'Sản phẩm không tồn tại trong giỏ hàng' },
        { status: 404 },
      );
    }

    const item = MOCK_CART.items[itemIndex];

    // Trường hợp đổi sang SKU khác (ví dụ chọn màu khác cho cùng 1 sản phẩm)
    if (body.newSku && body.newSku !== sku) {
      const newInventory = MOCK_INVENTORY.find(
        (inv) => inv.sku === body.newSku,
      );

      if (!newInventory) {
        return HttpResponse.json(
          { message: 'Biến thể mới không tồn tại' },
          { status: 400 },
        );
      }

      const existing = MOCK_CART.items.find((i) => i.sku === body.newSku);

      if (existing) {
        existing.quantity += body.quantity ?? item.quantity;
        MOCK_CART.items.splice(itemIndex, 1);
      } else {
        item.sku = body.newSku;
        item.unitPrice = newInventory.sku_price;
        item.stockQuantity = newInventory.stockQuantity;
        if (body.quantity !== undefined) item.quantity = body.quantity;
      }
    }
    // Chỉ cập nhật số lượng
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
    const initialLength = MOCK_CART.items.length;

    MOCK_CART.items = MOCK_CART.items.filter((i) => i.sku !== sku);

    if (MOCK_CART.items.length === initialLength) {
      return HttpResponse.json(
        { message: 'Sản phẩm không tồn tại trong giỏ hàng' },
        { status: 404 },
      );
    }

    return HttpResponse.json({
      message: 'Xóa sản phẩm khỏi giỏ hàng thành công',
      data: null,
    });
  }),
];