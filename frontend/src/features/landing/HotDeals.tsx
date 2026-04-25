'use client'

import React from 'react'
import { ChevronRight } from 'lucide-react'
import MOCK_PRODUCTS from '@/mocks/data/products'
import Link from 'next/link'
import ProductCard from '@/features/products/components/ProductCard'
import { ProductResponse } from '@/types/product.types'

export default function HotDeals() {
  // Just pick some products as "Hot Deals"
  const hotProducts = MOCK_PRODUCTS.slice(0, 5)

  return (
    <section className="container mx-auto px-4 section-padding">
      {/* Section: Hot Deals */}
      <div className="mb-10 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="animate-in fade-in slide-in-from-left-8 duration-1000">
          <span className="glass-badge-red">
            Đừng bỏ lỡ
          </span>
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
          <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
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
