'use client'

import { Button } from '@/components/ui/button'
import { CartItem } from '@/types/cart.types'
import { Card, CardContent } from '@/components/ui/card'
import { Trash } from 'lucide-react'
import formatVND from '@/features/cart/utils/formatVND'
import QuantitySelector from './QuantitySelector'
import { Checkbox } from '@/components/ui/checkbox'
import Image from 'next/image'
import { cn } from '@/lib/utils'

// Đảm bảo dùng đúng các trường thông tin đã lưu từ Modal
interface ItemCardProps {
  item: CartItem
  updateQuantity: (sku: string, delta: number) => void
  removeItem: (sku: string) => void
  isSelected: boolean
  onToggle: (checked: boolean) => void
}

const ItemCard = ({
  item,
  updateQuantity,
  removeItem,
  isSelected,
  onToggle,
}: ItemCardProps) => {
  const stockQuantity = item.stockQuantity ?? 99

  // Ở trang Cart, hàm updateQuantity từ useCart nhận (sku, delta)
  // nên ta chỉ cần truyền delta vào
  const handleQuantityChange = (delta: number) => {
    updateQuantity(item.sku, delta)
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-3 duration-500">
      <Card
        className={`group relative overflow-hidden rounded-[2.5rem] border-white/40 bg-white/40 shadow-xl shadow-slate-200/50 transition-all duration-500 backdrop-blur-3xl hover:shadow-2xl hover:shadow-slate-200/60 dark:border-white/10 dark:bg-white/5 dark:shadow-none ${
          isSelected
            ? 'ring-blue-500/20 border-blue-500/50 ring-8'
            : 'hover:border-blue-500/30'
        }`}
      >
        <CardContent className="p-6">
          <div className="flex gap-6">
            {/* Checkbox chọn sản phẩm */}
            <div className="flex items-center">
              <Checkbox
                checked={isSelected}
                onCheckedChange={(checked) => onToggle(!!checked)}
                id={`select-${item.sku}`}
                className="h-6 w-6 rounded-lg border-slate-200 transition-all data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
              />
            </div>

            {/* Product Image */}
            <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-3xl border border-white/60 bg-slate-100 dark:border-white/10 dark:bg-slate-800">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.productName}
                  fill
                  sizes="128px"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <div className="font-display flex h-full w-full items-center justify-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                  No Image
                </div>
              )}
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-linear-to-t from-slate-900/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>

            {/* Product Info */}
            <div className="flex flex-1 flex-col justify-between py-1">
              <div className="space-y-1">
                <div className="flex justify-between gap-4">
                  <h2 className="font-display line-clamp-1 text-xl font-black tracking-tight text-slate-900 dark:text-white">
                    {item.productName}
                  </h2>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-full text-slate-300 transition-all hover:bg-rose-50 hover:text-rose-500 active:scale-90 dark:hover:bg-rose-900/20"
                    onClick={() => removeItem(item.sku)}
                  >
                    <Trash className="h-4 w-4" strokeWidth={2.5} />
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-slate-100 px-3 py-1 font-mono text-[9px] font-black tracking-widest text-slate-400 uppercase dark:bg-slate-800">
                    SKU • {item.sku}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex items-end justify-between">
                <div className="space-y-2">
                  <p className="font-mono text-2xl font-black tracking-tighter text-blue-600 dark:text-blue-400">
                    {formatVND(item.skuPrice)}
                  </p>

                  <div className="flex items-center gap-2.5">
                    <span
                      className={cn(
                        "h-2 w-2 rounded-full animate-pulse",
                        stockQuantity <= 3 ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                      )}
                    />
                    <p
                      className={cn(
                        "font-display text-[10px] font-black tracking-widest uppercase",
                        stockQuantity <= 3 ? 'text-rose-500' : 'text-slate-400'
                      )}
                    >
                      {stockQuantity <= 3
                        ? `Ưu tiên (Còn ${stockQuantity})`
                        : `Sẵn hàng (${stockQuantity})`}
                    </p>
                  </div>
                </div>

                {/* Quantity Controller */}
                <div className="rounded-full bg-white p-1.5 shadow-xl shadow-slate-200/40 ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-white/5">
                  <QuantitySelector
                    quantity={item.quantity}
                    stockQuantity={stockQuantity}
                    onDecrease={() => handleQuantityChange(-1)}
                    onIncrease={() => handleQuantityChange(1)}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ItemCard
