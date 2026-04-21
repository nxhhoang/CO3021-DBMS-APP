'use client'

import React from 'react'
import {
  ArrowRight,
  Laptop,
  Smartphone,
  Watch,
  Footprints,
  Camera,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import CATEGORIES from '@/mocks/data/categories'

const categoryMetadata: Record<
  string,
  { icon: any; image: string; featured?: boolean }
> = {
  laptop: {
    icon: Laptop,
    image:
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=800',
    featured: true,
  },
  'dien-thoai': {
    icon: Smartphone,
    image:
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800',
    featured: true,
  },
  'dong-ho': {
    icon: Watch,
    image:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
  },
  giay: {
    icon: Footprints,
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800',
  },
  camera: {
    icon: Camera,
    image:
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800',
  },
}

export default function CategoriesSection() {
  return (
    <section
      className="container mx-auto px-4 py-24 sm:py-32"
      id="featured-categories"
    >
      {/* HEADER */}
      <div className="mb-16 flex flex-col items-center text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
        <div className="max-w-2xl">
          <span className="inline-block rounded-full border border-blue-100 bg-blue-50/50 px-4 py-1.5 text-[11px] font-semibold tracking-wide text-blue-600 backdrop-blur-sm">
            Khám phá danh mục
          </span>
          <h2 className="mt-5 font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Sản phẩm{' '}
            <span className="bg-linear-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              đáng mong đợi
            </span>
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Lựa chọn từ bộ sưu tập công nghệ và thời trang cao cấp nhất của
            chúng tôi.
          </p>
        </div>
        <Link
          href="/products"
          className="group mt-8 flex items-center gap-2 text-sm font-bold text-blue-600 transition-all hover:text-blue-800 sm:mt-0"
        >
          Xem tất cả{' '}
          <ArrowRight
            size={18}
            className="transition-transform group-hover:translate-x-1"
          />
        </Link>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-6 lg:grid-rows-2">
        {CATEGORIES.map((cat) => {
          const meta = categoryMetadata[cat.slug] || {
            icon: Laptop,
            image: '',
          }
          const Icon = meta.icon
          const isFeatured = meta.featured

          return (
            <div
              key={cat.slug}
              className={`group relative overflow-hidden rounded-[2.5rem] border border-white/40 bg-white/40 shadow-xl shadow-slate-200/50 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:bg-white/60 hover:shadow-2xl ${
                isFeatured ? 'lg:col-span-3' : 'lg:col-span-2'
              }`}
            >
              {/* IMAGE BACKGROUND */}
              <div className="absolute inset-0 z-0">
                <img
                  src={meta.image}
                  alt={cat.name}
                  className="h-full w-full object-cover opacity-40 transition-all duration-700 group-hover:scale-110 group-hover:opacity-50"
                />
                <div className="absolute inset-0 bg-linear-to-t from-white via-white/80 to-transparent" />
              </div>

              {/* CONTENT */}
              <div className="relative z-10 flex h-full flex-col justify-between p-8 sm:p-10">
                <div>
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/50 transition-transform group-hover:rotate-3 group-hover:scale-110">
                      <Icon className="text-blue-600" size={24} />
                    </div>
                    <span className="text-[10px] font-bold tracking-wide text-slate-400 uppercase">
                      Premium
                    </span>
                  </div>

                  <h3 className="font-display text-3xl font-bold tracking-tight text-slate-900">
                    {cat.name}
                  </h3>
                  <p className="mt-3 max-w-[280px] text-sm leading-relaxed text-slate-500">
                    {cat.description ||
                      'Khám phá những sản phẩm mới nhất trong danh mục này.'}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {cat.variantAttributes?.slice(0, 3).map((attr, i) => (
                      <span
                        key={i}
                        className="rounded-full border border-white bg-white/60 px-3 py-1 text-[10px] font-semibold text-slate-600 shadow-sm backdrop-blur-sm"
                      >
                        {attr.label}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-10">
                  <Button
                    className="group/btn relative w-full justify-between rounded-2xl bg-slate-900 py-7 text-xs font-bold tracking-wide text-white uppercase shadow-lg transition-all hover:bg-blue-600 active:scale-[0.98]"
                  >
                    Khám phá ngay
                    <ChevronRight
                      size={18}
                      className="transition-transform group-hover/btn:translate-x-1"
                    />
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
