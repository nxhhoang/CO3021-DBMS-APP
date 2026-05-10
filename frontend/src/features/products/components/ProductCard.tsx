'use client'

import React, { useState } from 'react'
import { ProductResponse } from '@/types/product.types'
import { Star, Plus, Eye, PlusSquareIcon } from 'lucide-react'
import { ProductImage } from '@/components/common/ProductImage'
import { Button } from '@/components/ui/button'
import { cn, formatPrice } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { useCart } from '@/features/cart'

export interface ProductCardProps {
  product: ProductResponse
  showDiscount?: boolean
  discountPercent?: number
  className?: string
}

export function ProductCard({
  product,
  showDiscount,
  discountPercent,
  className,
}: ProductCardProps) {
  // Calculate prices if discount is present
  const displayPrice =
    showDiscount && discountPercent
      ? product.basePrice * (1 - discountPercent / 100)
      : product.basePrice
  const originalPrice = product.basePrice
  const router = useRouter()
  const { addItem } = useCart()

  return (
    <>
      <div
        className={cn(
          'card-premium group relative flex cursor-pointer flex-col p-4',
          className,
        )}
        onClick={() => router.push(`/products/${product._id}`)}
      >
        {/* BADGE */}
        <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
          {showDiscount && discountPercent && (
            <span className="w-fit rounded-full bg-red-600 px-2.5 py-1 text-[10px] font-bold tracking-wider text-white uppercase shadow-lg">
              -{discountPercent}%
            </span>
          )}
          {product.totalSold > 50 && (
            <span className="w-fit rounded-full bg-slate-900 px-2.5 py-1 text-[10px] font-bold tracking-wider text-white uppercase shadow-lg">
              Bán chạy
            </span>
          )}
        </div>

        {/* IMAGE WRAPPER */}
        <div className="relative mb-4 aspect-square overflow-hidden rounded-2xl bg-slate-50">
          <ProductImage
            src={product.images?.[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* HOVER ACTIONS */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 backdrop-blur-[2px] transition-all duration-300 group-hover:opacity-100">
            <Button
              variant="secondary"
              className="rounded-full bg-white/90 px-6 font-bold text-slate-900 shadow-xl backdrop-blur-sm transition-all hover:bg-blue-600 hover:text-white"
            >
              <Eye size={16} className="mr-2" />
              Xem chi tiết
            </Button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex flex-1 flex-col">
          <div className="mb-1 flex items-center gap-1.5">
            <Star size={12} className="fill-yellow-400 text-yellow-400" />
            <span className="text-[10px] font-bold text-slate-500">
              {product.avgRating}{' '}
              <span className="mx-0.5 text-slate-300">|</span> Đã bán{' '}
              {product.totalSold || 0}
            </span>
          </div>

          <h3 className="font-display line-clamp-1 text-base font-bold text-slate-900 transition-colors group-hover:text-blue-600">
            {product.name}
          </h3>

          <p className="mt-1 line-clamp-1 text-xs text-slate-500">
            {product.category?.name ?? 'Sản phẩm cao cấp'}
          </p>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-slate-900">
                  {formatPrice(displayPrice)}
                </span>
                {showDiscount && (
                  <span className="text-xs text-slate-400 line-through">
                    {formatPrice(originalPrice)}
                  </span>
                )}
              </div>
            </div>
            <Button
              size="icon"
              className="h-10 w-10 rounded-xl bg-slate-900 transition-all hover:bg-blue-600 active:scale-90"
              onClick={(e) => {
                e.stopPropagation()
                addItem({
                  productId: product._id,
                  sku: product.sku || product._id,
                  quantity: 1,
                })
              }}
            >
              <Plus size={18} />
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
