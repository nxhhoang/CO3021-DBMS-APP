'use client'

import { useState } from 'react'
import { ProductResponse } from '@/types/product.types'
import { Star, Eye } from 'lucide-react'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ProductDetailModal } from './ProductDetailModal/ProductDetailModal'

const ProductCard = ({ product }: { product: ProductResponse }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <div
        className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-slate-100 bg-white p-2 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-slate-200/50 cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        {/* IMAGE WRAPPER */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-slate-50">
          <Image
            src={product.images?.[0] || '/images/default-product.png'}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* HOVER ACTIONS */}
          <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/5 opacity-0 backdrop-blur-[2px] transition-all duration-300 group-hover:opacity-100">
             <div className="rounded-full bg-white px-5 py-2.5 text-xs font-bold text-slate-900 shadow-lg transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                Chi tiết sản phẩm
             </div>
          </div>

          {/* BADGES */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <Badge className="w-fit bg-white/95 text-[10px] font-bold tracking-wider uppercase text-slate-900 backdrop-blur-md border-none px-3 py-1 shadow-xs">
              {product.category?.name ?? 'Sản phẩm'}
            </Badge>
            {product.totalSold > 50 && (
              <Badge className="w-fit bg-slate-900 text-[10px] font-bold tracking-wider uppercase text-white border-none px-3 py-1 shadow-xs">
                Bán chạy
              </Badge>
            )}
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex flex-1 flex-col p-4 pt-5">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-[11px] font-bold text-slate-700">{product.avgRating}</span>
              <span className="text-[11px] text-slate-300">|</span>
              <span className="text-[11px]">Đã bán {product.totalSold || 0}</span>
            </div>
          </div>
          
          <h3 className="line-clamp-2 min-h-[3.2rem] font-display text-lg font-bold tracking-tight text-slate-900 transition-colors group-hover:text-blue-600">
            {product.name}
          </h3>
          
          <div className="mt-5 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-mono text-xl font-black tracking-tighter text-slate-900">
                {product.basePrice.toLocaleString('vi-VN')}₫
              </span>
            </div>
            <Button
              className="h-10 rounded-full bg-slate-900 px-6 text-[11px] font-black tracking-widest uppercase text-white transition-all hover:scale-105 active:scale-95 dark:bg-white dark:text-slate-900"
            >
              Mua ngay
            </Button>
          </div>
        </div>
      </div>

      {/* Modal chi tiết sản phẩm */}
      <ProductDetailModal
        productId={product._id}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}

export default ProductCard
