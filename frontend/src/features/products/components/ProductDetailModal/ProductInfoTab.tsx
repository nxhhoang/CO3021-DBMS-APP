'use client'

import { Button } from '@/components/ui/button'
import { Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Inventory } from '@/types'

interface ProductInfoTabProps {
  inventory: Inventory[]
  selectedSku: Inventory | null
  setSelectedSku: (sku: Inventory) => void
  quantity: number
  setQuantity: (qty: number | ((prev: number) => number)) => void
  attributes?: Record<string, any>
}

export const ProductInfoTab = ({
  inventory,
  selectedSku,
  setSelectedSku,
  quantity,
  setQuantity,
  attributes,
}: ProductInfoTabProps) => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* SKU SELECTOR */}
      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <div className="h-1 w-4 rounded-full bg-blue-600" />
          <h4 className="font-display text-[11px] font-black tracking-[0.2em] text-slate-400 uppercase">
            Phiên bản
          </h4>
        </div>
        <div className="flex flex-wrap gap-3">
          {inventory?.map((item) => {
            const isSelected = selectedSku?.sku === item.sku
            const isOutOfStock = item.stockQuantity <= 0

            return (
              <button
                key={item.sku}
                disabled={isOutOfStock}
                onClick={() => setSelectedSku(item)}
                className={cn(
                  'group relative flex h-14 min-w-[140px] flex-col items-center justify-center rounded-2xl border-2 px-6 transition-all duration-300 active:scale-95',
                  isSelected
                    ? 'border-slate-900 bg-slate-900 text-white shadow-xl dark:bg-white dark:text-slate-900 dark:border-white'
                    : 'border-slate-100 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50/30 dark:border-white/10 dark:bg-slate-900 dark:hover:border-blue-500/50',
                  isOutOfStock && 'cursor-not-allowed opacity-30 grayscale',
                )}
              >
                <span
                  className={cn(
                    'font-mono text-xs font-black tracking-tighter uppercase',
                    isSelected ? (isSelected ? 'text-white dark:text-slate-900' : 'text-slate-600') : 'text-slate-600 dark:text-slate-400',
                  )}
                >
                  {item.sku.split('-').join(' • ')}
                </span>
                {isOutOfStock && (
                  <span className="absolute -top-2 -right-2 rounded-full bg-rose-500 px-2 py-0.5 text-[8px] font-black text-white uppercase tracking-widest">
                    Hết
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* QUANTITY SELECTOR */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-1 w-4 rounded-full bg-cyan-500" />
            <h4 className="font-display text-[11px] font-black tracking-[0.2em] text-slate-400 uppercase">
              Số lượng
            </h4>
          </div>
          <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            KHO: <span className="text-slate-900 dark:text-white">{selectedSku?.stockQuantity || 0}</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex h-16 items-center gap-4 rounded-full border border-slate-100 bg-slate-50/50 p-2 dark:border-white/5 dark:bg-slate-900/50">
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 rounded-full bg-white shadow-sm hover:bg-slate-50 active:scale-90 dark:bg-slate-800 dark:hover:bg-slate-700"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Minus className="h-4 w-4" strokeWidth={3} />
            </Button>
            <span className="font-mono w-10 text-center text-xl font-black text-slate-900 dark:text-white">
              {quantity}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 rounded-full bg-white shadow-sm hover:bg-slate-50 active:scale-90 dark:bg-slate-800 dark:hover:bg-slate-700"
              onClick={() =>
                setQuantity((prev) =>
                  Math.min(selectedSku?.stockQuantity || 1, prev + 1),
                )
              }
            >
              <Plus className="h-4 w-4" strokeWidth={3} />
            </Button>
          </div>
        </div>
      </div>

      {/* VARIANT ATTRIBUTES */}
      {selectedSku?.attributes && Object.keys(selectedSku.attributes).length > 0 && (
        <div className="space-y-5 rounded-[2rem] border border-blue-50 bg-blue-50/30 p-8 dark:border-blue-900/10 dark:bg-blue-900/10">
           <div className="flex items-center gap-2">
            <div className="h-1 w-4 rounded-full bg-blue-400" />
            <h4 className="font-display text-[11px] font-black tracking-[0.2em] text-blue-700 dark:text-blue-400 uppercase">
              Thông số phiên bản
            </h4>
          </div>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
            {Object.entries(selectedSku.attributes).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <span className="font-display text-[10px] font-black text-slate-400 uppercase tracking-widest">{key}</span>
                <p className="text-sm font-black text-slate-900 dark:text-white">{String(value)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PRODUCT DYNAMIC ATTRIBUTES */}
      {attributes && Object.keys(attributes).length > 0 && (
        <div className="space-y-5">
           <div className="flex items-center gap-2">
            <div className="h-1 w-4 rounded-full bg-slate-400" />
            <h4 className="font-display text-[11px] font-black tracking-[0.2em] text-slate-400 uppercase">
              Thông số kỹ thuật
            </h4>
          </div>
          <div className="divide-y divide-slate-100 overflow-hidden rounded-[2rem] border border-slate-100 bg-white dark:divide-white/5 dark:border-white/5 dark:bg-slate-900/50">
            {Object.entries(attributes).map(([key, value]) => (
              <div
                key={key}
                className="flex items-center justify-between px-8 py-5 transition-colors hover:bg-slate-50 dark:hover:bg-white/5"
              >
                <span className="font-display text-[11px] font-black tracking-widest text-slate-400 uppercase">
                  {key}
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">{String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
