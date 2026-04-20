'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { AspectRatio } from '@/components/ui/aspect-ratio'
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
      <Card
        className="group cursor-pointer overflow-hidden rounded-lg transition-all hover:shadow-md"
        onClick={() => setIsModalOpen(true)} // Click vào card để xem chi tiết
      >
        <div className="relative">
          <AspectRatio ratio={1}>
            <Image
              src={product.images?.[0] || '/images/default-product.png'}
              alt={product.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          </AspectRatio>
          {/* Overlay khi hover */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
            <Button variant="secondary" size="sm" className="gap-2">
              <Eye className="h-4 w-4" /> Xem chi tiết
            </Button>
          </div>
        </div>

        <CardContent className="space-y-2 p-3">
          <Badge variant="secondary" className="text-xs">
            {product.category?.name ?? 'Chưa phân loại'}
          </Badge>
          <h3 className="line-clamp-2 h-10 text-sm font-medium">
            {product.name}
          </h3>
          <p className="text-primary text-sm font-bold">
            {product.basePrice.toLocaleString()}đ
          </p>
          <div className="text-muted-foreground flex items-center gap-1 text-xs">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            {product.avgRating}
            <span className="ml-auto">Đã bán {product.totalSold}</span>
          </div>
        </CardContent>
      </Card>

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
