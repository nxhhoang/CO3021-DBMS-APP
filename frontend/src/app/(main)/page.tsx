import React from 'react'
import { Search, ArrowRight, Laptop, Smartphone, Cpu, Box } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

// 1. DỮ LIỆU MOCK DỰA TRÊN API RESPONSE
const apiResponse = {
  message: 'Get categories successfully',
  data: [
    {
      _id: '69df50e8e488633b2831f26d',
      name: 'Laptop',
      slug: 'laptop',
      description: 'Máy tính xách tay cao cấp cho công việc và giải trí',
      isActive: true,
      icon: Laptop, // Map thêm icon để hiển thị
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
    <div className="min-h-screen bg-white text-slate-900">
      {/* HERO SECTION - Phong cách Modern Luxury từ ảnh mẫu */}
      <section className="container mx-auto px-4 py-8">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-[#f8f9fa] lg:flex lg:items-center">
          <div className="z-10 p-8 md:p-16 lg:w-1/2">
            <span className="text-xs font-bold tracking-widest text-blue-600 uppercase">
              Edition 2024
            </span>
            <h1 className="mt-4 text-5xl leading-tight font-black tracking-tighter italic md:text-7xl">
              FUTURE <br />
              <span className="text-blue-500 underline decoration-blue-200 underline-offset-4">
                DIGITAL.
              </span>
            </h1>
            <p className="mt-6 max-w-md text-slate-500">
              Khám phá bộ sưu tập công nghệ được tuyển chọn, nơi sự chính xác
              kiến trúc kết hợp với sự sang trọng hiện đại.
            </p>
            <div className="mt-8 flex gap-4">
              <Button className="rounded-full bg-blue-600 px-8 py-6 hover:bg-blue-700">
                MUA NGAY
              </Button>
              <Button
                variant="outline"
                className="rounded-full border-slate-200 px-8 py-6"
              >
                XEM THÊM
              </Button>
            </div>
          </div>
          <div className="relative h-[400px] bg-slate-200 lg:h-[600px] lg:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800"
              alt="Hero Product"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* SEARCH BAR */}
      <section className="container mx-auto px-4 py-12">
        <div className="relative mx-auto max-w-2xl">
          <input
            type="text"
            placeholder="Tìm Laptop, Điện thoại hay linh kiện..."
            className="w-full rounded-full border border-slate-200 bg-slate-50 py-5 pr-6 pl-14 text-lg outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          <Search
            className="absolute top-1/2 left-5 -translate-y-1/2 text-slate-400"
            size={24}
          />
        </div>
      </section>

      {/* CATEGORIES - Hiển thị dựa trên Data API */}
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
            className="flex items-center text-xs font-bold text-blue-600 uppercase hover:underline"
          >
            Tất cả sản phẩm <ArrowRight size={14} className="ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="group relative flex flex-col overflow-hidden rounded-[2rem] bg-slate-50 transition-all hover:shadow-2xl md:flex-row"
            >
              {/* Image side */}
              <div className="h-64 w-full overflow-hidden md:h-auto md:w-2/5">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* Content side */}
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

                  {/* Render Variant Options from API */}
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
                              className="rounded-md border border-slate-100 bg-white px-2 py-1 text-[10px] font-medium text-slate-600"
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
                    className="w-full rounded-xl bg-white py-6 text-[10px] font-bold tracking-widest uppercase shadow-sm transition-colors hover:bg-slate-900 hover:text-white"
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
  )
}
