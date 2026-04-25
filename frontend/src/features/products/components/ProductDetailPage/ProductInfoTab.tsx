'use client'

import { cn } from '@/lib/utils'
import { Inventory } from '@/types'
import { QuantitySelector } from '@/features/cart'

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
    <div className="animate-in fade-in slide-in-from-bottom-4 grid grid-cols-1 gap-12 duration-700 lg:grid-cols-2">
      {/* LEFT COLUMN: SELECTION */}
      <div className="space-y-10">
        {/* SKU SELECTOR */}
        <div className="space-y-5">
          <div className="flex items-center gap-2">
            <div className="h-1 w-4 rounded-full bg-blue-600" />
            <h4 className="font-display text-[11px] font-black tracking-[0.2em] text-slate-400 uppercase">
              Phiên bản
            </h4>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {inventory?.map((item) => {
              const isSelected = selectedSku?.sku === item.sku
              const isOutOfStock = item.stockQuantity <= 0

              return (
                <button
                  key={item.sku}
                  disabled={isOutOfStock}
                  onClick={() => setSelectedSku(item)}
                  className={cn(
                    'group relative flex h-10 items-center justify-center rounded-xl border-2 px-3 transition-all duration-300 active:scale-95',
                    isSelected
                      ? 'border-slate-900 bg-slate-900 text-white shadow-lg dark:border-white dark:bg-white dark:text-slate-900'
                      : 'border-slate-100 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50/30 dark:border-white/10 dark:bg-slate-900 dark:hover:border-blue-500/50',
                    isOutOfStock && 'cursor-not-allowed opacity-30 grayscale',
                  )}
                >
                  <span
                    className={cn(
                      'font-mono text-[10px] font-black tracking-tighter uppercase',
                      isSelected
                        ? 'text-white dark:text-slate-900'
                        : 'text-slate-600 dark:text-slate-400',
                    )}
                  >
                    {item.sku.split('-').join(' • ')}
                  </span>
                  {isOutOfStock && (
                    <span className="absolute -top-1.5 -right-1.5 rounded-full bg-rose-500 px-1.5 py-0.5 text-[7px] font-black tracking-tighter text-white uppercase">
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
            <span className="font-mono text-[10px] font-bold tracking-widest text-slate-400 uppercase">
              KHO:{' '}
              <span className="text-slate-900 dark:text-white">
                {selectedSku?.stockQuantity || 0}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <QuantitySelector
              quantity={quantity}
              stockQuantity={selectedSku?.stockQuantity || 1}
              onDecrease={() => setQuantity(Math.max(1, quantity - 1))}
              onIncrease={() =>
                setQuantity((prev) =>
                  Math.min(selectedSku?.stockQuantity || 1, prev + 1),
                )
              }
              size="lg"
            />
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: SPECIFICATIONS */}
      <div className="space-y-10">
        {/* VARIANT ATTRIBUTES */}
        {selectedSku?.attributes &&
          Object.keys(selectedSku.attributes).length > 0 && (
            <div className="space-y-5 rounded-[2rem] border border-blue-50 bg-blue-50/30 dark:border-blue-900/10 dark:bg-blue-900/10">
              <div className="flex items-center gap-2">
                <div className="h-1 w-4 rounded-full bg-blue-400" />
                <h4 className="font-display text-[11px] font-black tracking-[0.2em] text-blue-700 uppercase dark:text-blue-400">
                  Thông số phiên bản
                </h4>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-2">
                {Object.entries(selectedSku.attributes).map(([key, value]) => (
                  <div key={key} className="space-y-0.5">
                    <span className="font-display text-[10px] font-black tracking-widest text-slate-400 uppercase">
                      {key}
                    </span>
                    <p className="text-xs font-black text-slate-900 dark:text-white">
                      {String(value)}
                    </p>
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
                  className="flex items-center justify-between px-8 py-4 transition-colors hover:bg-slate-50 dark:hover:bg-white/5"
                >
                  <span className="font-display text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    {key}
                  </span>
                  <span className="text-[13px] font-bold text-slate-900 dark:text-white">
                    {String(value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
