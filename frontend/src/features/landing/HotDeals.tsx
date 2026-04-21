'use client'

import React from 'react'
import { ChevronRight, Star, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import MOCK_PRODUCTS from '@/mocks/data/products'
import Link from 'next/link'

export default function HotDeals() {
  // Just pick some products as "Hot Deals"
  const hotProducts = MOCK_PRODUCTS.slice(0, 5)

  return (
    <section className="container mx-auto px-4 py-20">
      <div className="mb-10 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div>
          <span className="inline-block rounded-full bg-red-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-red-600">
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

      <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide">
        {hotProducts.map((product) => (
          <div
            key={product._id}
            className="group relative min-w-[280px] overflow-hidden rounded-3xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:shadow-xl hover:shadow-slate-200/50"
          >
            {/* BADGE */}
            <div className="absolute top-4 left-4 z-10">
              <span className="rounded-full bg-red-600 px-2.5 py-1 text-[10px] font-bold text-white shadow-lg">
                -20%
              </span>
            </div>

            {/* IMAGE */}
            <div className="relative mb-4 aspect-square overflow-hidden rounded-2xl bg-slate-50">
              <img
                src={product.images?.[0]}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/5" />
            </div>

            {/* CONTENT */}
            <div>
              <div className="mb-1 flex items-center gap-1">
                <Star size={12} className="fill-yellow-400 text-yellow-400" />
                <span className="text-[10px] font-bold text-slate-500">
                  {product.avgRating} ({product.totalReviews})
                </span>
              </div>
              <h3 className="line-clamp-1 font-display text-base font-bold text-slate-900 transition-colors group-hover:text-blue-600">
                {product.name}
              </h3>
              <p className="mt-1 line-clamp-1 text-xs text-slate-500">
                {product.description}
              </p>

              <div className="mt-4 flex items-center justify-between">
                <div>
                  <span className="text-lg font-bold text-slate-900">
                    {(product.basePrice * 0.8).toLocaleString('vi-VN')}đ
                  </span>
                  <span className="ml-2 text-xs text-slate-400 line-through">
                    {product.basePrice.toLocaleString('vi-VN')}đ
                  </span>
                </div>
                <Button
                  size="icon"
                  className="h-10 w-10 rounded-xl bg-slate-900 transition-all hover:bg-blue-600 active:scale-90"
                >
                  <ShoppingCart size={18} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
