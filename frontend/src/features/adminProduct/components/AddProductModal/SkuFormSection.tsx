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
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-blue-600" />
            <h3 className="font-display text-sm font-bold tracking-tight text-slate-900 dark:text-white">
              Biến thể sản phẩm (SKU)
            </h3>
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Define product variations
          </p>
        </div>
        {!isAdding && selectedCategoryId && (
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setIsAdding(true)
              setSkuPrice(basePrice)
            }}
            className="h-9 rounded-xl border-slate-200 bg-white px-4 text-[10px] font-black tracking-widest uppercase transition-all hover:border-blue-400 hover:bg-blue-50/50 hover:text-blue-600 dark:border-white/10 dark:bg-slate-900"
          >
            <Plus className="mr-2 h-3.5 w-3.5" />
            Thêm mới
          </Button>
        )}
      </div>

      {!selectedCategoryId && (
        <div className="rounded-2xl bg-amber-50 p-4 text-xs font-medium text-amber-700">
          Vui lòng chọn danh mục trước khi thêm biến thể.
        </div>
      )}

      {isAdding && (
        <div className="animate-in fade-in slide-in-from-top-2 rounded-2xl border border-blue-100 bg-blue-50/20 p-6 duration-300 dark:border-blue-500/10 dark:bg-blue-500/5">
          <div className="mb-6 flex items-center justify-between">
            <h4 className="font-display text-sm font-bold tracking-tight text-blue-900 dark:text-blue-400">
              Cấu hình biến thể mới
            </h4>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsAdding(false)}
              className="h-8 w-8 rounded-full p-0 text-blue-400 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-500/20"
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
                className="input-premium h-10 text-xs"
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
                className="input-premium h-10 text-xs"
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
                className="input-premium h-10 text-xs"
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
                    className="flex h-10 w-full rounded-xl border border-slate-200/60 bg-white px-3 py-2 text-xs transition-all focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 focus:outline-hidden dark:border-white/10 dark:bg-slate-900"
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
                    className="input-premium h-10 text-xs"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-end">
            <Button
              type="button"
              onClick={handleAddLocalSku}
              className="h-10 rounded-xl bg-blue-600 px-8 text-[10px] font-black tracking-widest uppercase text-white transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/20 active:scale-95"
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
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-5 transition-all hover:border-blue-200 hover:shadow-sm dark:border-white/5 dark:bg-white/5"
              >
                <button
                  type="button"
                  onClick={() => removeSku(idx)}
                  className="absolute -top-1 -right-1 z-20 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-white opacity-0 shadow-lg transition-all hover:scale-110 group-hover:opacity-100 dark:bg-white dark:text-slate-900"
                >
                  <Trash2 size={12} />
                </button>
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1 space-y-3">
                    <div className="space-y-1">
                      <p className="truncate text-sm font-black tracking-tight text-slate-900 dark:text-white">
                        {item.sku}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {Object.entries(item.attributes).map(([k, v]) => (
                          <div
                            key={k}
                            className="flex items-center rounded-lg bg-slate-50 px-2 py-0.5 text-[9px] font-bold text-slate-500 dark:bg-white/5"
                          >
                            <span className="mr-1 opacity-60">{k}:</span>
                            <span className="text-slate-700 dark:text-slate-300">{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-mono text-sm font-black text-blue-600 dark:text-blue-400">
                      {item.skuPrice.toLocaleString()}đ
                    </p>
                    <p className="mt-1 font-mono text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Kho: <span className="font-black text-slate-900 dark:text-white">{item.stockQuantity}</span>
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
