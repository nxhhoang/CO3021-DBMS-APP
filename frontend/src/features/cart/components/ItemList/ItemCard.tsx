'use client'

import { Button } from '@/components/ui/button'
import { CartItem } from '@/types/cart.types'
import { Card, CardContent } from '@/components/ui/card'
import { Trash } from 'lucide-react'
import formatVND from '@/features/cart/utils/formatVND'
import QuantitySelector from './QuantitySelector'
import { Checkbox } from '@/components/ui/checkbox'
import Image from 'next/image'

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
    <div className="animate-in fade-in slide-in-from-bottom-2 flex items-start gap-4 duration-300">
      <Card
        className={`group flex-1 shadow-sm transition-all ${
          isSelected
            ? 'border-primary/50 ring-primary/10 ring-2'
            : 'hover:border-primary/20'
        }`}
      >
        <CardContent className="p-4">
          <div className="flex gap-4">
            {/* Checkbox chọn sản phẩm */}
            <div className="flex items-center">
              <Checkbox
                checked={isSelected}
                onCheckedChange={(checked) => onToggle(!!checked)}
                id={`select-${item.sku}`}
              />
            </div>

            {/* Product Image */}
            <div className="bg-muted relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.productName}
                  fill
                  sizes="96px"
                  className="object-cover transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="text-muted-foreground flex h-full w-full items-center justify-center text-[10px]">
                  No Image
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <div className="flex justify-between gap-2">
                  <h2 className="line-clamp-1 text-base font-bold">
                    {item.productName}
                  </h2>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive h-8 w-8 transition-colors"
                    onClick={() => removeItem(item.sku)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>

                <p className="text-muted-foreground text-[11px] font-medium tracking-wider uppercase">
                  SKU: {item.sku}
                </p>
              </div>

              <div className="mt-2 flex items-end justify-between">
                <div className="space-y-1">
                  <p className="text-primary text-lg font-black">
                    {formatVND(item.skuPrice)}
                  </p>

                  <p
                    className={`text-[10px] font-bold uppercase ${
                      stockQuantity <= 3
                        ? 'text-destructive'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {stockQuantity <= 3
                      ? `Chỉ còn ${stockQuantity} sp!`
                      : `Kho: ${stockQuantity}`}
                  </p>
                </div>

                {/* Quantity Controller */}
                <QuantitySelector
                  quantity={item.quantity}
                  stockQuantity={stockQuantity}
                  onDecrease={() => handleQuantityChange(-1)}
                  onIncrease={() => handleQuantityChange(1)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ItemCard
