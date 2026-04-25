'use client'

import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useProducts } from '../../hooks/useProducts'
import { ProductCard } from '../ProductCard'

interface RelatedProductsProps {
  categorySlug: string
  currentProductId: string
}

export const RelatedProducts = ({
  categorySlug,
  currentProductId,
}: RelatedProductsProps) => {
  const { products, loading } = useProducts({
    category: categorySlug,
    limit: 8,
  })
  const related = products.filter((p) => p._id !== currentProductId).slice(0, 4)

  if (!loading && related.length === 0) return null

  return (
    <section className="mt-16 border-t border-slate-100 pt-16">
      <div className="mb-10 flex flex-col items-center gap-3 text-center">
        <div className="glass-badge-blue w-fit">Có thể bạn cũng thích</div>
        <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900">
          Sản phẩm <span className="text-gradient-primary">Liên quan</span>
        </h2>
        <p className="text-slate-500">Khám phá thêm sản phẩm cùng danh mục.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                className="h-full"
              />
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <Link
              href={`/products?category=${categorySlug}`}
              className="tab-premium tab-premium-inactive px-8 py-3 font-bold"
            >
              Xem tất cả sản phẩm danh mục này →
            </Link>
          </div>
        </>
      )}
    </section>
  )
}
