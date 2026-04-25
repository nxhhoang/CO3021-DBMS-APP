import { http, HttpResponse } from 'msw'
import {
  SyncCartRequest,
  CartItem,
  UpdateCartItemRequest,
} from '@/types/cart.types'
import { BASE_URL } from '@/constants/api'
import { MOCK_CART } from '../data/cart'
import { MOCK_PRODUCTS } from '../data/products'
import { MOCK_INVENTORY } from '../data/inventory'

export const cartHandlers = [
  // 1. POST /cart/sync
  http.post(`${BASE_URL}/cart/sync`, async ({ request }) => {
    const body = (await request.json()) as SyncCartRequest

    // Khởi tạo danh sách mới dựa trên dữ liệu hiện có hoặc rỗng tùy logic business
    // Ở đây tôi giữ lại data cũ và merge thêm data mới từ request
    const merged: CartItem[] = [...MOCK_CART.items]

    for (const reqItem of body.items) {
      const productId = reqItem.productId || reqItem.productID
      const product = MOCK_PRODUCTS.find((p) => p._id === productId)
      const inventory = MOCK_INVENTORY.find((inv) => inv.sku === reqItem.sku)

      if (!product || !inventory) continue

      const existingIndex = merged.findIndex((i) => i.sku === reqItem.sku)

      if (existingIndex > -1) {
        // Cập nhật số lượng và giá mới nhất
        merged[existingIndex].quantity += reqItem.quantity
        merged[existingIndex].skuPrice = inventory.sku_price
      } else {
        // Thêm mới item
        merged.push({
          productId: product._id,
          productID: product._id,
          sku: reqItem.sku,
          quantity: reqItem.quantity,
          productName: product.name,
          image: product.images[0] || '',
          basePrice: product.base_price, // Giá gốc từ bảng sản phẩm
          skuPrice: inventory.sku_price, // Giá biến thể từ kho
          stockQuantity: inventory.stock_quantity,
        })
      }
    }

    // Tính tổng tiền
    const cartTotal = merged.reduce(
      (total, item) => total + item.skuPrice * item.quantity,
      0,
    )

    MOCK_CART.items = merged
    MOCK_CART.cartTotal = cartTotal

    return HttpResponse.json({
      message: 'Đồng bộ giỏ hàng thành công',
      data: {
        cartTotal,
        items: merged,
      },
    })
  }),

  // 2. PUT /cart/items/:sku
  http.put(`${BASE_URL}/cart/items/:sku`, async ({ request, params }) => {
    const { sku } = params
    const body = (await request.json()) as UpdateCartItemRequest

    const itemIndex = MOCK_CART.items.findIndex((i) => i.sku === sku)
    if (itemIndex === -1) {
      return HttpResponse.json(
        { message: 'Sản phẩm không có trong giỏ' },
        { status: 404 },
      )
    }

    const item = MOCK_CART.items[itemIndex]

    // Trường hợp đổi SKU (đổi màu sắc/kích thước)
    if (body.newSku && body.newSku !== sku) {
      const newInv = MOCK_INVENTORY.find((inv) => inv.sku === body.newSku)
      if (!newInv) {
        return HttpResponse.json(
          { message: 'Biến thể mới không tồn tại' },
          { status: 400 },
        )
      }

      // Kiểm tra xem SKU mới đã có trong giỏ chưa
      const existingNewSkuIndex = MOCK_CART.items.findIndex(
        (i) => i.sku === body.newSku,
      )

      if (existingNewSkuIndex > -1) {
        // Nếu đã có, cộng dồn vào SKU đó và xóa SKU cũ
        MOCK_CART.items[existingNewSkuIndex].quantity +=
          body.quantity ?? item.quantity
        MOCK_CART.items.splice(itemIndex, 1)
      } else {
        // Nếu chưa có, cập nhật thông tin SKU cũ thành mới
        item.sku = body.newSku
        item.skuPrice = newInv.sku_price
        if (body.quantity !== undefined) item.quantity = body.quantity
      }
    }
    // Chỉ cập nhật số lượng cho SKU hiện tại
    else if (body.quantity !== undefined) {
      item.quantity = body.quantity
    }

    // Cập nhật lại tổng tiền sau khi thay đổi
    MOCK_CART.cartTotal = MOCK_CART.items.reduce(
      (t, i) => t + i.skuPrice * i.quantity,
      0,
    )

    return HttpResponse.json({ message: 'Cập nhật thành công', data: null })
  }),

  // 3. DELETE /cart/items/:sku
  http.delete(`${BASE_URL}/cart/items/:sku`, async ({ params }) => {
    const { sku } = params
    const initialLength = MOCK_CART.items.length

    MOCK_CART.items = MOCK_CART.items.filter((i) => i.sku !== sku)

    if (MOCK_CART.items.length === initialLength) {
      return HttpResponse.json(
        { message: 'Sản phẩm không tồn tại' },
        { status: 404 },
      )
    }

    MOCK_CART.cartTotal = MOCK_CART.items.reduce(
      (t, i) => t + i.skuPrice * i.quantity,
      0,
    )

    return HttpResponse.json({ message: 'Xóa thành công', data: null })
  }),
]
