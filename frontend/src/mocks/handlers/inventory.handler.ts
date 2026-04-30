import { http, HttpResponse } from 'msw'
import { BASE_URL } from '@/constants/api'
import { isAdmin, mockDb, requireSession } from '../data/mockDb'

function sanitizeAttributes(
  input: Record<string, unknown> | undefined,
): Record<string, string | number | boolean> {
  const out: Record<string, string | number | boolean> = {}
  if (!input) return out
  for (const [k, v] of Object.entries(input)) {
    if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') {
      out[k] = v
    } else if (v == null) {
      // skip null/undefined
    } else {
      out[k] = String(v)
    }
  }
  return out
}

export const inventoryHandlers = [
  // POST /admin/inventories/sku
  http.post(`${BASE_URL}/admin/inventories/sku`, async ({ request }) => {
    const auth = requireSession(request.headers.get('Authorization'))
    if (!auth.ok) return HttpResponse.json(auth.response, { status: auth.status })
    if (!isAdmin(auth.session.userId)) {
      return HttpResponse.json({ message: 'Forbidden', data: null }, { status: 403 })
    }

    const body = (await request.json()) as {
      productID: string
      sku: string
      skuPrice: number
      stockQuantity: number
      attributes: Record<string, unknown>
    }

    if (!body?.productID || !body?.sku) {
      return HttpResponse.json({ message: 'Thiếu dữ liệu SKU', data: null }, { status: 400 })
    }

    const exists = mockDb.inventory.some((i) => i.sku === body.sku)
    if (exists) {
      return HttpResponse.json({ message: 'SKU already exists', data: null }, { status: 409 })
    }

    mockDb.inventory.push({
      sku: body.sku,
      skuPrice: body.skuPrice,
      sku_price: body.skuPrice,
      stockQuantity: body.stockQuantity,
      attributes: sanitizeAttributes(body.attributes),
    })

    return HttpResponse.json({ message: 'Tạo SKU thành công', data: { sku: body.sku } }, { status: 201 })
  }),
]

