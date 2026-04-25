'use client'

import React from 'react'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export function PromoBanners() {
  return (
    <section className="section-padding container mx-auto px-4">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* BANNER 1 */}
        <div className="group relative h-[400px] overflow-hidden rounded-[2.5rem] bg-slate-900">
          <img
            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1200"
            alt="Fashion Promo"
            className="absolute inset-0 h-full w-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-r from-slate-900 via-slate-900/40 to-transparent" />

          <div className="relative flex h-full flex-col justify-center p-10 md:p-12">
            <span className="text-sm font-bold tracking-widest text-blue-400 uppercase">
              Bộ sưu tập mới
            </span>
            <h3 className="mt-4 max-w-[300px] text-4xl font-bold text-white sm:text-5xl">
              Nâng tầm <br /> Phong cách
            </h3>
            <p className="mt-4 max-w-xs text-slate-300">
              Khám phá những mẫu giày và phụ kiện thời thượng nhất năm 2024.
            </p>
            <Link
              href="/products?category=giay"
              className="mt-8 flex w-fit items-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-bold text-slate-900 transition-all hover:bg-blue-600 hover:text-white hover:shadow-lg active:scale-95"
            >
              Mua ngay <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        {/* BANNER 2 */}
        <div className="group relative h-[400px] overflow-hidden rounded-[2.5rem] bg-cyan-900">
          <img
            src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1200"
            alt="Watch Promo"
            className="absolute inset-0 h-full w-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-r from-cyan-950 via-cyan-900/40 to-transparent" />

          <div className="relative flex h-full flex-col justify-center p-10 md:p-12">
            <span className="text-sm font-bold tracking-widest text-cyan-400 uppercase">
              Đẳng cấp thời gian
            </span>
            <h3 className="mt-4 max-w-[300px] text-4xl font-bold text-white sm:text-5xl">
              Đồng hồ <br /> Sang trọng
            </h3>
            <p className="mt-4 max-w-xs text-slate-300">
              Những thiết kế tinh xảo từ các thương hiệu hàng đầu thế giới.
            </p>
            <Link
              href="/products?category=dong-ho"
              className="mt-8 flex w-fit items-center gap-2 rounded-full bg-cyan-500 px-8 py-3 text-sm font-bold text-white transition-all hover:bg-white hover:text-cyan-900 hover:shadow-lg active:scale-95"
            >
              Khám phá <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
