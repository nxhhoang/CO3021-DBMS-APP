'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Package, Trash2, X } from 'lucide-react'
import { Category } from '@/types/category.types'
import { Badge } from '@/components/ui/badge'

export interface LocalSku {
  sku: string
  skuPrice: number
  stockQuantity: number
  attributes: Record<string, any>
}

interface SkuFormSectionProps {
  skus: LocalSku[]
  setSkus: (skus: LocalSku[]) => void
  categories: Category[]
  selectedCategoryId: string
  basePrice: number
}

export default function SkuFormSection({
  skus,
  setSkus,
  categories,
  selectedCategoryId,
  basePrice,
}: SkuFormSectionProps) {
  const [isAdding, setIsAdding] = useState(false)

  // Form states for NEW sku
  const [sku, setSku] = useState('')
  const [skuPrice, setSkuPrice] = useState(basePrice)
  const [stockQuantity, setStockQuantity] = useState(0)
  const [attributes, setAttributes] = useState<Record<string, any>>({})

  const category = categories.find((c) => c._id === selectedCategoryId)
  const variantAttributes = category?.variantAttributes || []

  const handleAddLocalSku = () => {
    if (!sku) return
    const newSku: LocalSku = {
      sku,
      skuPrice,
      stockQuantity,
      attributes,
    }
    setSkus([...skus, newSku])
    // Reset form
    setSku('')
    setSkuPrice(basePrice)
    setStockQuantity(0)
    setAttributes({})
    setIsAdding(false)
  }

  const removeSku = (index: number) => {
    setSkus(skus.filter((_, i) => i !== index))
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
            Biến thể sản phẩm (SKU)
          </h3>
        </div>
        {!isAdding && selectedCategoryId && (
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setIsAdding(true)
              setSkuPrice(basePrice)
            }}
            className="rounded-xl border-dashed border-slate-300 px-4 py-2 text-xs font-bold transition-all hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600"
          >
            <Plus className="mr-2 h-4 w-4" />
            Thêm biến thể
          </Button>
        )}
      </div>

      {!selectedCategoryId && (
        <div className="rounded-2xl bg-amber-50 p-4 text-xs font-medium text-amber-700">
          Vui lòng chọn danh mục trước khi thêm biến thể.
        </div>
      )}

      {isAdding && (
        <div className="animate-in fade-in slide-in-from-top-2 rounded-3xl border border-indigo-100 bg-indigo-50/30 p-6 duration-300">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="text-sm font-bold text-indigo-900">
              Cấu hình biến thể mới
            </h4>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsAdding(false)}
              className="h-8 w-8 rounded-full p-0 text-indigo-400 hover:bg-indigo-100 hover:text-indigo-600"
            >
              <X className="h-4 w-4" />
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
                placeholder="Ví dụ: SKU-001"
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
              type="button"
              onClick={handleAddLocalSku}
              className="rounded-xl bg-indigo-600 px-6 font-bold text-white transition-all hover:bg-indigo-700 active:scale-95"
            >
              Lưu biến thể này
            </Button>
          </div>
        </div>
      )}

      {/* List of pending SKUs */}
      <div className="space-y-3">
        {skus.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {skus.map((item, idx) => (
              <div
                key={idx}
                className="group relative rounded-2xl border border-slate-100 bg-white p-4 transition-all hover:border-indigo-100 hover:shadow-md"
              >
                <button
                  type="button"
                  onClick={() => removeSku(idx)}
                  className="absolute -top-2 -right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100"
                >
                  <Trash2 size={12} />
                </button>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-900">
                      {item.sku}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(item.attributes).map(([k, v]) => (
                        <Badge
                          key={k}
                          variant="secondary"
                          className="bg-slate-50 px-2 py-0 text-[10px] text-slate-500"
                        >
                          {k}: {v}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-indigo-600">
                      {item.skuPrice.toLocaleString()}đ
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
          !isAdding && (
            <div className="flex flex-col items-center justify-center rounded-[28px] border border-dashed border-slate-200 py-10">
              <Package className="mb-2 h-8 w-8 text-slate-200" />
              <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                Chưa có biến thể nào
              </p>
            </div>
          )
        )}
      </div>
    </div>
  )
}
