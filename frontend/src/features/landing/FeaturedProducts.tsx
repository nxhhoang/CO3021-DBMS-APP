'use client'

import React, { useState } from 'react'
import { ShoppingCart, Heart, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import MOCK_PRODUCTS from '@/mocks/data/products'

const TABS = [
  { id: 'bestseller', label: 'Bán chạy' },
  { id: 'new', label: 'Mới về' },
  { id: 'toprated', label: 'Đánh giá cao' },
]

export default function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState('bestseller')

  // Filter logic for tabs
  const getFilteredProducts = () => {
    switch (activeTab) {
      case 'bestseller':
        return [...MOCK_PRODUCTS].sort((a, b) => b.totalSold - a.totalSold).slice(0, 8)
      case 'new':
        return MOCK_PRODUCTS.slice(4, 12)
      case 'toprated':
        return [...MOCK_PRODUCTS].sort((a, b) => b.avgRating - a.avgRating).slice(0, 8)
      default:
        return MOCK_PRODUCTS.slice(0, 8)
    }
  }

  const products = getFilteredProducts()

  return (
    <section className="container mx-auto px-4 py-24">
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-bold tracking-tight text-slate-900">
          Sản phẩm{' '}
          <span className="bg-linear-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            Đặc sắc
          </span>
        </h2>
        <p className="mt-4 text-slate-500">
          Tổng hợp những sản phẩm tốt nhất từ mọi danh mục dành riêng cho bạn.
        </p>

        <div className="mt-8 flex justify-center gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-full px-6 py-2 text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-lg'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <div
            key={product._id}
            className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-slate-100 bg-white p-2 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-200"
          >
            {/* IMAGE WRAPPER */}
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-slate-50">
              <img
                src={product.images?.[0]}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* HOVER ACTIONS */}
              <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/10 opacity-0 backdrop-blur-[2px] transition-opacity group-hover:opacity-100">
                <Button size="icon" variant="secondary" className="rounded-full shadow-lg hover:bg-blue-600 hover:text-white">
                  <Heart size={18} />
                </Button>
                <Button size="icon" variant="secondary" className="rounded-full shadow-lg hover:bg-blue-600 hover:text-white">
                  <Eye size={18} />
                </Button>
              </div>

              {product.totalSold > 100 && (
                <div className="absolute top-4 left-4">
                  <span className="rounded-full bg-blue-600 px-3 py-1 text-[10px] font-bold text-white shadow-lg">
                    HOT
                  </span>
                </div>
              )}
            </div>

            {/* CONTENT */}
            <div className="flex flex-1 flex-col p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                  {product.attributes.brand as string || 'Premium'}
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-bold text-slate-900">{product.avgRating}</span>
                  <ShoppingCart size={10} className="text-blue-600" />
                </div>
              </div>
              
              <h3 className="line-clamp-1 flex-1 font-display text-lg font-bold text-slate-900 group-hover:text-blue-600">
                {product.name}
              </h3>
              
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xl font-bold text-slate-900">
                  {product.basePrice.toLocaleString('vi-VN')}đ
                </span>
                <Button className="rounded-xl bg-slate-900 px-4 text-xs font-bold transition-all hover:bg-blue-600">
                  Mua ngay
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
