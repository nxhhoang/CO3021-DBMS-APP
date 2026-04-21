'use client'

import { Badge } from '@/components/ui/badge'
import { DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import formatVND from '@/features/cart/utils/formatVND'

interface ProductHeaderProps {
  name: string
  categoryName?: string
  avgRating: number
  totalReviews: number
  displayPrice: number
  stockQuantity: number
}

export const ProductHeader = ({
  name,
  categoryName,
  avgRating,
  totalReviews,
  displayPrice,
  stockQuantity,
}: ProductHeaderProps) => {
  return (
    <div className="p-6 pb-2 sm:p-10 sm:pb-4">
      <div className="mb-6 space-y-4">
        <div className="flex items-center justify-between">
          <Badge className="border-none bg-slate-100 px-4 py-1.5 text-[10px] font-bold tracking-widest text-slate-600 uppercase">
            {categoryName || 'Sản phẩm'}
          </Badge>
          <div className="hidden items-center gap-1.5 lg:flex">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-bold text-slate-900">{avgRating || 5}</span>
            <span className="text-sm text-slate-400">({totalReviews || 0} đánh giá)</span>
          </div>
        </div>

        <DialogHeader className="p-0 text-left">
          <DialogTitle className="font-display text-3xl leading-tight font-black text-slate-900 sm:text-4xl">
            {name}
          </DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-6 pt-2">
          <div className="font-mono text-4xl font-black tracking-tighter text-blue-600 dark:text-blue-400">
            {formatVND(displayPrice)}
          </div>
          <div className="h-10 w-px bg-slate-100 dark:bg-white/10" />
          <div className="flex flex-col">
            <span className="font-display text-[10px] font-black tracking-widest text-slate-400 uppercase">
              Tình trạng
            </span>
            <span
              className={cn(
                'text-sm font-bold',
                stockQuantity > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500',
              )}
            >
              {stockQuantity > 0 ? `Còn ${stockQuantity} sản phẩm` : 'Đã hết hàng'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
