'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Package, Trash2, Loader2, X } from 'lucide-react'
import { toast } from 'sonner'
import { inventoryService } from '@/services/inventory.service'
import { Category } from '@/types/category.types'
import { ProductDetail } from '@/types/product.types'
import { Badge } from '@/components/ui/badge'

interface SkuManagementProps {
  product: ProductDetail
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
  const [editingInventoryId, setEditingInventoryId] = useState<string | null>(null)
  const [tempStockQuantity, setTempStockQuantity] = useState<number>(0)
  const [isUpdating, setIsUpdating] = useState(false)

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

  const handleUpdateStock = async (inventoryId: string) => {
    if (!inventoryId) return
    setIsUpdating(true)
    try {
      await inventoryService.updateStock(inventoryId, tempStockQuantity)
      toast.success('Cập nhật tồn kho thành công!')
      setEditingInventoryId(null)
      onRefresh()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật tồn kho')
    } finally {
      setIsUpdating(false)
    }
  }

  const startEditing = (item: any) => {
    setEditingInventoryId(item.inventoryID)
    setTempStockQuantity(item.stockQuantity)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-blue-600" />
            <h3 className="font-display text-sm font-bold tracking-tight text-slate-900 dark:text-white">
              Quản lý biến thể (SKU)
            </h3>
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Inventory variations
          </p>
        </div>
        {!isAdding && (
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsAdding(true)}
            className="h-9 rounded-xl border-slate-200 bg-white px-4 text-[10px] font-black tracking-widest uppercase transition-all hover:border-blue-400 hover:bg-blue-50/50 hover:text-blue-600 dark:border-white/10 dark:bg-slate-900"
          >
            <Plus className="mr-2 h-3.5 w-3.5" />
            Thêm mới
          </Button>
        )}
      </div>

      {isAdding && (
        <div className="animate-in fade-in slide-in-from-top-2 rounded-2xl border border-blue-100 bg-blue-50/20 p-6 duration-300 dark:border-blue-500/10 dark:bg-blue-500/5">
          <div className="mb-6 flex items-center justify-between">
            <h4 className="font-display text-sm font-bold tracking-tight text-blue-900 dark:text-blue-400">Tạo SKU mới</h4>
            <Button
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
                placeholder="Ví dụ: IP15-BLU-128"
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
              onClick={handleAddSku}
              disabled={loading}
              className="h-10 rounded-xl bg-blue-600 px-8 text-[10px] font-black tracking-widest uppercase text-white transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/20 active:scale-95"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
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
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-5 transition-all hover:border-blue-200 hover:shadow-sm dark:border-white/5 dark:bg-white/5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1 space-y-3">
                    <div className="space-y-1">
                      <p className="truncate text-sm font-black tracking-tight text-slate-900 dark:text-white">
                        {item.sku}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {Object.entries(item.attributes || {}).map(
                          ([k, v]: [any, any]) => (
                            <div
                              key={k}
                              className="flex items-center rounded-lg bg-slate-50 px-2 py-0.5 text-[9px] font-bold text-slate-500 dark:bg-white/5"
                            >
                              <span className="mr-1 opacity-60">{k}:</span>
                              <span className="text-slate-700 dark:text-slate-300">{v}</span>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-mono text-sm font-black text-blue-600 dark:text-blue-400">
                      {item.skuPrice?.toLocaleString()}đ
                    </p>
                  </div>
                </div>

                <div className="mt-6 border-t border-slate-50 pt-4 dark:border-white/5">
                  {editingInventoryId === item.inventoryID ? (
                    <div className="flex items-center justify-between animate-in fade-in slide-in-from-bottom-2">
                      <div className="flex items-center gap-2">
                        <Label className="text-[9px] font-black tracking-widest text-slate-400 uppercase">
                          Số lượng:
                        </Label>
                        <Input
                          type="number"
                          value={tempStockQuantity}
                          onChange={(e) => setTempStockQuantity(Number(e.target.value))}
                          className="h-8 w-24 rounded-lg bg-slate-50 text-center font-mono text-xs font-bold ring-blue-500/20 transition-all focus:bg-white focus:ring-4 dark:bg-white/5"
                          autoFocus
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingInventoryId(null)}
                          className="h-8 rounded-lg px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400"
                        >
                          Hủy
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleUpdateStock(item.inventoryID)}
                          disabled={isUpdating}
                          className="h-8 rounded-lg bg-blue-600 px-4 text-[10px] font-black uppercase tracking-widest text-white hover:bg-blue-700"
                        >
                          {isUpdating ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Lưu'}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                        <p className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          Kho: <span className="font-black text-slate-900 dark:text-white">{item.stockQuantity}</span>
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEditing(item)}
                        className="h-7 rounded-lg px-3 text-[9px] font-black uppercase tracking-widest text-blue-600 transition-all hover:bg-blue-50 dark:hover:bg-blue-500/10"
                      >
                        Chỉnh sửa
                      </Button>
                    </div>
                  )}
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
