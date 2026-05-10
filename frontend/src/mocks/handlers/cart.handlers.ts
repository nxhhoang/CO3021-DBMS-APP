import { http, HttpResponse } from 'msw'
import {
  SyncCartRequest,
  CartItem,
  UpdateCartItemRequest,
} from '@/types/cart.types'
import { BASE_URL } from '@/constants/api'
import { mockDb, requireSession } from '../data/mockDb'

export const cartHandlers = [
  // 1. POST /cart/sync
  http.post(`${BASE_URL}/cart/sync`, async ({ request }) => {
    const auth = requireSession(request.headers.get('Authorization'))
    if (!auth.ok) return HttpResponse.json(auth.response, { status: auth.status })

    const body = (await request.json()) as SyncCartRequest

    // Khởi tạo danh sách mới dựa trên dữ liệu hiện có hoặc rỗng tùy logic business
    // Ở đây tôi giữ lại data cũ và merge thêm data mới từ request
    const merged: CartItem[] = [...mockDb.cart.items]

    for (const reqItem of body.items) {
      const productId = reqItem.productId || reqItem.productID
      const product = mockDb.products.find((p) => p._id === productId)
      const inventory = mockDb.inventory.find((inv) => inv.sku === reqItem.sku)

      if (!product || !inventory) continue

      const existingIndex = merged.findIndex((i) => i.sku === reqItem.sku)

      if (existingIndex > -1) {
        // Cập nhật số lượng và giá mới nhất
        merged[existingIndex].quantity += reqItem.quantity
        merged[existingIndex].skuPrice = inventory.skuPrice ?? inventory.sku_price ?? product.basePrice
      } else {
        // Thêm mới item
        merged.push({
          productId: product._id,
          productID: product._id,
          sku: reqItem.sku,
          quantity: reqItem.quantity,
          productName: product.name,
          image: product.images?.[0] || '',
          basePrice: product.basePrice,
          skuPrice: inventory.skuPrice ?? inventory.sku_price ?? product.basePrice,
          stockQuantity: inventory.stockQuantity,
          attributes: inventory.attributes ?? {},
        })
      }
    }

    // Tính tổng tiền
    const cartTotal = merged.reduce(
      (total, item) => total + item.skuPrice * item.quantity,
      0,
    )

    mockDb.cart.items = merged
    mockDb.cart.cartTotal = cartTotal

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
    const auth = requireSession(request.headers.get('Authorization'))
    if (!auth.ok) return HttpResponse.json(auth.response, { status: auth.status })

    const { sku } = params
    const body = (await request.json()) as UpdateCartItemRequest

    const itemIndex = mockDb.cart.items.findIndex((i) => i.sku === sku)
    if (itemIndex === -1) {
      return HttpResponse.json(
        { message: 'Sản phẩm không có trong giỏ', data: null },
        { status: 404 },
      )
    }

    const item = mockDb.cart.items[itemIndex]

    // Trường hợp đổi SKU (đổi màu sắc/kích thước)
    if (body.newSku && body.newSku !== sku) {
      const newInv = mockDb.inventory.find((inv) => inv.sku === body.newSku)
      if (!newInv) {
        return HttpResponse.json(
          { message: 'Biến thể mới không tồn tại', data: null },
          { status: 400 },
        )
      }

      // Kiểm tra xem SKU mới đã có trong giỏ chưa
      const existingNewSkuIndex = mockDb.cart.items.findIndex(
        (i) => i.sku === body.newSku,
      )

      if (existingNewSkuIndex > -1) {
        // Nếu đã có, cộng dồn vào SKU đó và xóa SKU cũ
        mockDb.cart.items[existingNewSkuIndex].quantity +=
          body.quantity ?? item.quantity
        mockDb.cart.items.splice(itemIndex, 1)
      } else {
        // Nếu chưa có, cập nhật thông tin SKU cũ thành mới
        item.sku = body.newSku
        item.skuPrice = newInv.skuPrice ?? newInv.sku_price ?? item.skuPrice
        item.stockQuantity = newInv.stockQuantity
        item.attributes = newInv.attributes ?? item.attributes
        if (body.quantity !== undefined) item.quantity = body.quantity
      }
    }
    // Chỉ cập nhật số lượng cho SKU hiện tại
    else if (body.quantity !== undefined) {
      item.quantity = body.quantity
    }

    // Cập nhật lại tổng tiền sau khi thay đổi
    mockDb.cart.cartTotal = mockDb.cart.items.reduce(
      (t, i) => t + i.skuPrice * i.quantity,
      0,
    )

    return HttpResponse.json({ message: 'Cập nhật thành công', data: null })
  }),

  // 3. DELETE /cart/items/:sku
  http.delete(`${BASE_URL}/cart/items/:sku`, async ({ params, request }) => {
    const auth = requireSession(request.headers.get('Authorization'))
    if (!auth.ok) return HttpResponse.json(auth.response, { status: auth.status })

    const { sku } = params
    const initialLength = mockDb.cart.items.length

    mockDb.cart.items = mockDb.cart.items.filter((i) => i.sku !== sku)

    if (mockDb.cart.items.length === initialLength) {
      return HttpResponse.json(
        { message: 'Sản phẩm không tồn tại', data: null },
        { status: 404 },
      )
    }

    mockDb.cart.cartTotal = mockDb.cart.items.reduce(
      (t, i) => t + i.skuPrice * i.quantity,
      0,
    )

    return HttpResponse.json({ message: 'Xóa thành công', data: null })
  }),
]
