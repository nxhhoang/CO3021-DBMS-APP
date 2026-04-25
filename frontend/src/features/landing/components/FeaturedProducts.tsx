'use client'

import React, { useState } from 'react'
import { ShoppingCart, Heart, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MOCK_PRODUCTS } from '@/mocks/data/products'
import { cn } from '@/lib/utils'
import { ProductCard, useProducts } from '@/features/products'

const TABS = [
  { id: 'bestseller', label: 'Bán chạy' },
  { id: 'new', label: 'Mới về' },
  { id: 'toprated', label: 'Đánh giá cao' },
]

export function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState('bestseller')

  // Filter logic for tabs
  const getFilteredProducts = () => {
    switch (activeTab) {
      case 'bestseller':
        return [...MOCK_PRODUCTS]
          .sort((a, b) => b.totalSold - a.totalSold)
          .slice(0, 8)
      case 'new':
        return MOCK_PRODUCTS.slice(4, 12)
      case 'toprated':
        return [...MOCK_PRODUCTS]
          .sort((a, b) => b.avgRating - a.avgRating)
          .slice(0, 8)
      default:
        return MOCK_PRODUCTS.slice(0, 8)
    }
  }

  const products = getFilteredProducts()

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
