'use client'

import React from 'react'
import { Search, ArrowRight, Laptop, Smartphone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import HeroSection from '@/features/landing/HeroSection'

const apiResponse = {
  message: 'Get categories successfully',
  data: [
    {
      _id: '69df50e8e488633b2831f26d',
      name: 'Laptop',
      slug: 'laptop',
      description: 'Máy tính xách tay cao cấp cho công việc và giải trí',
      isActive: true,
      icon: Laptop,
      image:
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=600',
      variantAttributes: [
        { label: 'RAM', options: ['8GB', '16GB', '32GB'] },
        { label: 'Màu sắc', options: ['Silver', 'Space Gray', 'Black'] },
      ],
    },
    {
      _id: '69df50e8e488633b2831f26e',
      name: 'Điện thoại',
      slug: 'dien-thoai',
      description: 'Điện thoại thông minh thế hệ mới với hiệu năng vượt trội',
      isActive: true,
      icon: Smartphone,
      image:
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=600',
      variantAttributes: [
        { label: 'Màu sắc', options: ['Black', 'White', 'Blue', 'Gold'] },
        { label: 'Dung lượng', options: ['128GB', '256GB', '512GB'] },
      ],
    },
  ],
}

export default function LandingPage() {
  const categories = apiResponse.data

  return (
    <div className="relative isolate min-h-screen w-full overflow-clip bg-white text-slate-900">
      {/* IMPROVED BACKGROUND SYSTEM */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* Base Layer Gradient */}
        <div className="absolute inset-0 bg-linear-to-b from-slate-50 via-white to-slate-100" />

        {/* Thick & Tilted Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.25]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(148, 163, 184, 0.4) 1.5px, transparent 1.5px),
              linear-gradient(to bottom, rgba(148, 163, 184, 0.4) 1.5px, transparent 1.5px)
            `,
            backgroundSize: '40px 40px',
            transform: 'skewY(-2deg) scale(1.5)', // Tạo độ nghiêng và bao phủ hết màn hình
            transformOrigin: 'top left',
          }}
        />

        {/* Dynamic Glow Blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-[10%] -left-[5%] h-[500px] w-[500px] rounded-full bg-cyan-200/25 blur-[120px]" />
          <div className="absolute top-[20%] -right-[10%] h-[600px] w-[600px] rounded-full bg-blue-200/20 blur-[140px]" />
          <div className="absolute bottom-[-10%] left-[20%] h-[500px] w-[700px] rounded-full bg-indigo-100/30 blur-[130px]" />
        </div>

        {/* Subtle Radial Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,white_90%)] opacity-40" />
      </div>

      <div className="relative z-10">
        <HeroSection />

        {/* SEARCH BAR */}
        <section
          id="featured-categories"
          className="container mx-auto scroll-mt-24 px-4 py-12"
        >
          <div className="relative mx-auto max-w-2xl">
            <input
              type="text"
              placeholder="Tìm Laptop, Điện thoại hay linh kiện..."
              className="w-full rounded-full border border-slate-200 bg-white/70 py-5 pr-6 pl-14 text-lg shadow-xl shadow-slate-200/50 backdrop-blur-xl transition-all outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10"
            />
            <Search
              className="absolute top-1/2 left-5 -translate-y-1/2 text-slate-400"
              size={24}
            />
          </div>
        </section>

        {/* CATEGORIES */}
        <section className="container mx-auto px-4 py-12">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tighter uppercase">
                Danh mục nổi bật
              </h2>
              <div className="mt-2 h-1 w-12 bg-blue-600"></div>
            </div>
            <Link
              href="/products"
              className="flex items-center text-xs font-bold text-blue-600 uppercase transition-colors hover:text-blue-800"
            >
              Tất cả sản phẩm <ArrowRight size={14} className="ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {categories.map((cat) => (
              <div
                key={cat._id}
                className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-white/60 bg-white/40 shadow-sm backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:bg-white/60 hover:shadow-2xl md:flex-row"
              >
                <div className="h-64 w-full overflow-hidden md:h-auto md:w-2/5">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>

                <div className="flex flex-col justify-between p-8 md:w-3/5">
                  <div>
                    <div className="mb-3 flex items-center gap-2 text-blue-600">
                      <cat.icon size={20} />
                      <span className="text-[10px] font-bold tracking-widest uppercase">
                        Premium Collection
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight italic">
                      {cat.name}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                      {cat.description}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-4">
                      {cat.variantAttributes.slice(0, 2).map((attr, idx) => (
                        <div key={idx}>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">
                            {attr.label}
                          </span>
                          <div className="mt-1 flex gap-1">
                            {attr.options.slice(0, 3).map((opt, i) => (
                              <span
                                key={i}
                                className="rounded-md border border-slate-100 bg-white/80 px-2 py-1 text-[10px] font-medium text-slate-600 shadow-xs"
                              >
                                {opt}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8">
                    <Button
                      variant="ghost"
                      className="w-full rounded-xl bg-white/90 py-6 text-[10px] font-bold tracking-widest uppercase shadow-sm transition-all hover:bg-slate-900 hover:text-white active:scale-[0.98]"
                    >
                      Khám phá ngay
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}