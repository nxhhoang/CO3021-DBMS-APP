'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { ProductCard, useProducts } from '@/features/products'
import { SORT_BY } from '@/constants/enum'

const TABS = [
  { id: 'bestseller', label: 'Bán chạy' },
  { id: 'new', label: 'Mới về' },
  { id: 'toprated', label: 'Đánh giá cao' },
]

export function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState('bestseller')

  // Filter logic for tabs
  const getProducts = () => {
    switch (activeTab) {
      case 'bestseller':
        return useProducts({
          sort: SORT_BY.SOLD_DESC,
          limit: 8,
        })
      case 'new':
        return useProducts({
          sort: SORT_BY.SOLD_ASC,
          limit: 8,
        })
      case 'toprated':
        return useProducts({
          sort: SORT_BY.RATING_DESC,
          limit: 8,
        })
      default:
        return useProducts({
          limit: 8,
        })
    }
  }

  const { products } = getProducts()

  return (
    <section className="section-padding container mx-auto px-4">
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-bold tracking-tight text-slate-900">
          Sản phẩm <span className="text-gradient-primary">Đặc sắc</span>
        </h2>
        <p className="mt-4 text-slate-500">
          Tổng hợp những sản phẩm tốt nhất từ mọi danh mục dành riêng cho bạn.
        </p>

        <div className="mt-8 flex justify-center gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'tab-premium',
                activeTab === tab.id
                  ? 'tab-premium-active'
                  : 'tab-premium-inactive',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product as any}
            className="h-full"
          />
        ))}
      </div>
    </section>
  )
}
