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
        className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:shadow-lg cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="relative aspect-square overflow-hidden bg-slate-50">
          <Image
            src={product.images?.[0] || '/images/default-product.png'}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          <div className="absolute top-3 right-3 opacity-0 transition-all duration-300 group-hover:opacity-100">
             <div className="rounded-full bg-white/90 p-2 text-slate-600 shadow-sm backdrop-blur-sm">
                <Eye size={16} />
             </div>
          </div>

          <div className="absolute bottom-3 left-3">
             <Badge className="bg-slate-900/80 text-[10px] font-medium tracking-wider uppercase backdrop-blur-sm border-none">
                {product.category?.name ?? 'Sản phẩm'}
             </Badge>
          </div>
        </div>

        <div className="flex flex-col gap-3 p-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-[11px] font-medium">{product.avgRating}</span>
              <span className="text-[11px] text-slate-300">|</span>
              <span className="text-[11px]">Đã bán {product.totalSold || 0}</span>
            </div>
            <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold text-slate-800 transition-colors group-hover:text-blue-600">
              {product.name}
            </h3>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-base font-bold text-slate-900">
              {product.basePrice.toLocaleString()}₫
            </span>
            <Button
              variant="secondary"
              size="sm"
              className="h-8 rounded-lg bg-slate-100 px-3 text-[11px] font-bold text-slate-900 hover:bg-slate-200"
            >
              Chi tiết
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
