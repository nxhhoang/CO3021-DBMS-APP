'use client'

import React from 'react'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { ProductCard, useProducts } from '@/features/products'
import { ProductResponse } from '@/types/product.types'
import { SORT_BY } from '@/constants/enum'

export function HotDeals() {
  // Just pick some products as "Hot Deals"
  const hotProducts = useProducts({
    sort: SORT_BY.SOLD_DESC,
    limit: 5,
  }).products

  return (
    <section className="section-padding container mx-auto px-4">
      {/* Section: Hot Deals */}
      <div className="mb-10 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="animate-in fade-in slide-in-from-left-8 duration-1000">
          <span className="glass-badge-red">Đừng bỏ lỡ</span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Ưu đãi{' '}
            <span className="bg-linear-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
              Hấp dẫn nhất
            </span>
          </h2>
        </div>
        <Link
          href="/products"
          className="group flex items-center gap-2 text-sm font-bold text-slate-900 transition-colors hover:text-blue-600"
        >
          Xem tất cả deal
          <ChevronRight
            size={18}
            className="transition-transform group-hover:translate-x-1"
          />
        </Link>
      </div>

      <div className="scrollbar-hide animate-in fade-in slide-in-from-bottom-12 flex gap-6 overflow-x-auto pb-8 delay-300 duration-1000">
        {hotProducts.map((product) => (
          <ProductCard
            key={product._id}
            product={product as unknown as ProductResponse}
            showDiscount={true}
            discountPercent={20}
            className="min-w-[280px] md:min-w-[320px]"
          />
        ))}
      </div>
    </section>
  )
}
