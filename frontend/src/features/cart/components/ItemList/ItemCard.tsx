'use client'

import { Button } from '@/components/ui/button'
import { CartItem } from '@/types/cart.types'
import { Card, CardContent } from '@/components/ui/card'
import { Trash } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { QuantitySelector } from './QuantitySelector'
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

  const handleQuantityChange = (delta: number) => {
    updateQuantity(item.sku, delta)
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <Card
        onClick={() => onToggle(!isSelected)}
        className={cn(
          'glass-card group relative cursor-pointer overflow-hidden border-transparent transition-all duration-300',
          isSelected
            ? 'border-blue-500/50 bg-blue-50/5 shadow-lg dark:bg-blue-900/5'
            : 'hover:border-slate-200 dark:hover:border-white/10',
        )}
      >
        <CardContent className="p-4 sm:p-5">
          <div className="flex gap-4 sm:gap-6">
            {/* Checkbox */}
            <div className="flex items-center">
              <Checkbox
                checked={isSelected}
                onCheckedChange={(checked) => onToggle(!!checked)}
                onClick={(e) => e.stopPropagation()}
                className="checkbox-premium"
              />
            </div>

            {/* Product Image */}
            <div className="image-container-premium h-24 w-24 shrink-0 sm:h-28 sm:w-28">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.productName}
                  fill
                  sizes="(max-width: 640px) 96px, 112px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-slate-50 text-[10px] font-bold text-slate-300 uppercase dark:bg-slate-800">
                  No Image
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <h2 className="font-display truncate text-lg font-bold text-slate-900 sm:text-xl dark:text-white">
                    {item.productName}
                  </h2>
                  <p className="mt-1 font-mono text-[10px] font-medium tracking-tight text-slate-400 uppercase">
                    {item.sku}
                  </p>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0 rounded-full text-slate-300 hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-900/20"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeItem(item.sku)
                  }}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>

              <div className="mt-auto flex items-end justify-between pt-4">
                <div className="space-y-1.5">
                  <p className="font-mono text-xl font-bold tracking-tighter text-blue-600 sm:text-2xl dark:text-blue-400">
                    {formatPrice(item.skuPrice)}
                  </p>

                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        'h-1.5 w-1.5 rounded-full',
                        stockQuantity <= 3 ? 'bg-rose-500' : 'bg-emerald-500',
                      )}
                    />
                    <span
                      className={cn(
                        'text-[10px] font-bold tracking-wide uppercase',
                        stockQuantity <= 3 ? 'text-rose-500' : 'text-slate-400',
                      )}
                    >
                      {stockQuantity <= 3
                        ? `Sắp hết (${stockQuantity})`
                        : 'Sẵn hàng'}
                    </span>
                  </div>
                </div>

                <QuantitySelector
                  quantity={item.quantity}
                  stockQuantity={stockQuantity}
                  onDecrease={() => handleQuantityChange(-1)}
                  onIncrease={() => handleQuantityChange(1)}
                  size="sm"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export { ItemCard }
