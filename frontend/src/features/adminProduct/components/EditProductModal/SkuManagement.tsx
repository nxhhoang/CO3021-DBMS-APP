'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Package, Trash2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { inventoryService } from '@/services/inventory.service'
import { Category } from '@/types/category.types'
import { ProductResponse } from '@/types/product.types'
import { Badge } from '@/components/ui/badge'

interface SkuManagementProps {
  product: ProductResponse
  categories: Category[]
  onRefresh: () => void
}

export default function SkuManagement({
  product,
  categories,
  onRefresh,
}: SkuManagementProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [loading, setLoading] = useState(false)

  // Form states
  const [sku, setSku] = useState('')
  const [skuPrice, setSkuPrice] = useState(product.basePrice)
  const [stockQuantity, setStockQuantity] = useState(0)
  const [attributes, setAttributes] = useState<Record<string, any>>({})

  const category = categories.find((c) => c._id === product.category?._id)
  const variantAttributes = category?.variantAttributes || []

  const handleAddSku = async () => {
    if (!sku) {
      toast.error('Vui lòng nhập mã SKU')
      return
    }

    setLoading(true)
    try {
      await inventoryService.createSku({
        productID: product._id,
        sku,
        skuPrice,
        stockQuantity,
        attributes,
      })
      toast.success('Thêm SKU thành công!')
      setIsAdding(false)
      setSku('')
      setSkuPrice(product.basePrice)
      setStockQuantity(0)
      setAttributes({})
      onRefresh()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi thêm SKU')
    } finally {
      setLoading(false)
    }
  }

  const handleAttrChange = (key: string, value: any) => {
    setAttributes((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-slate-400" />
          <h3 className="text-lg font-semibold text-slate-900">
            Quản lý biến thể (SKU)
          </h3>
        </div>
        {!isAdding && (
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsAdding(true)}
            className="rounded-xl border-dashed border-slate-300 px-4 py-2 text-xs font-bold transition-all hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600"
          >
            <Plus className="mr-2 h-4 w-4" />
            Thêm biến thể mới
          </Button>
        )}
      </div>

      {isAdding && (
        <div className="animate-in fade-in slide-in-from-top-2 rounded-3xl border border-indigo-100 bg-indigo-50/30 p-6 duration-300">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="text-sm font-bold text-indigo-900">Tạo SKU mới</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsAdding(false)}
              className="h-8 w-8 rounded-full p-0 text-indigo-400 hover:bg-indigo-100 hover:text-indigo-600"
            >
              <Plus className="h-4 w-4 rotate-45" />
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                Mã SKU
              </Label>
              <Input
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="Ví dụ: IP15-BLU-128"
                className="h-11 rounded-xl border-none bg-white shadow-sm ring-1 ring-slate-200"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                Giá SKU (VNĐ)
              </Label>
              <Input
                type="number"
                value={skuPrice}
                onChange={(e) => setSkuPrice(Number(e.target.value))}
                className="h-11 rounded-xl border-none bg-white shadow-sm ring-1 ring-slate-200"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                Số lượng tồn kho
              </Label>
              <Input
                type="number"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(Number(e.target.value))}
                className="h-11 rounded-xl border-none bg-white shadow-sm ring-1 ring-slate-200"
              />
            </div>

            {variantAttributes.map((attr) => (
              <div key={attr.key} className="space-y-2">
                <Label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  {attr.label}
                </Label>
                {attr.options && attr.options.length > 0 ? (
                  <select
                    value={attributes[attr.key] || ''}
                    onChange={(e) => handleAttrChange(attr.key, e.target.value)}
                    className="flex h-11 w-full rounded-xl border-none bg-white px-3 py-2 text-sm shadow-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  >
                    <option value="">Chọn {attr.label}</option>
                    {attr.options.map((opt) => (
                      <option key={String(opt)} value={String(opt)}>
                        {String(opt)}
                      </option>
                    ))}
                  </select>
                ) : (
                  <Input
                    value={attributes[attr.key] || ''}
                    onChange={(e) => handleAttrChange(attr.key, e.target.value)}
                    placeholder={`Nhập ${attr.label}`}
                    className="h-11 rounded-xl border-none bg-white shadow-sm ring-1 ring-slate-200"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <Button
              onClick={handleAddSku}
              disabled={loading}
              className="rounded-xl bg-indigo-600 px-6 font-bold text-white transition-all hover:bg-indigo-700 active:scale-95"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang tạo...
                </>
              ) : (
                'Xác nhận tạo biến thể'
              )}
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {product.inventory && product.inventory.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {product.inventory.map((item: any, idx: number) => (
              <div
                key={item.sku || idx}
                className="group relative rounded-2xl border border-slate-100 bg-white p-4 transition-all hover:border-indigo-100 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-900">
                      {item.sku}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(item.attributes || {}).map(
                        ([k, v]: [any, any]) => (
                          <Badge
                            key={k}
                            variant="secondary"
                            className="bg-slate-50 px-2 py-0 text-[10px] text-slate-500"
                          >
                            {k}: {v}
                          </Badge>
                        ),
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-indigo-600">
                      {item.skuPrice?.toLocaleString()}đ
                    </p>
                    <p className="text-[10px] font-medium text-slate-400">
                      Kho: {item.stockQuantity}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-[28px] border border-dashed border-slate-200 py-12">
            <Package className="mb-3 h-10 w-10 text-slate-200" />
            <p className="text-sm font-medium text-slate-400">
              Sản phẩm này chưa có biến thể nào
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
