'use client'

import {
  ProductCard,
  ProductFilter,
  ProductSort,
  useProducts,
  ProductPagination,
} from '@/features/products'
import { Skeleton } from '@/components/ui/skeleton'
import { useMemo } from 'react'
import { useCategories } from '@/features/categories'

export default function ProductsPage() {
  const { products, params, loading, pagination } = useProducts()
  const { categories } = useCategories()

  const categoryName = useMemo(() => {
    return categories?.find((c) => c.slug === params.category)?.name
  }, [categories, params.category])

  const title = useMemo(() => {
    if (params.keyword) {
      return `Kết quả tìm kiếm cho "${params.keyword}"`
    }

    if (params.category) {
      return `Danh mục: ${categoryName || params.category}`
    }

    return 'Tất cả sản phẩm'
  }, [params.keyword, params.category, categoryName])

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold">{title}</h1>
        <span className="text-muted-foreground text-sm">
          {pagination.totalItems} sản phẩm
        </span>
      </div>

      <div className="flex flex-col gap-8 md:flex-row">
        <aside className="bg-primary/20 w-full space-y-6 md:w-64">
          <ProductSort />
          <ProductFilter />
        </aside>

        {/* Danh sách sản phẩm */}
        <main className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="space-y-4 text-center md:text-left">
              <div className="glass-badge-blue">Cửa hàng trực tuyến</div>
              <h1 className="font-display text-4xl font-bold tracking-tight text-slate-900 lg:text-5xl">
                Khám phá <span className="text-gradient-primary">Sản phẩm</span>
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-slate-500 md:mx-0">
                Tìm kiếm những thiết bị công nghệ và phụ kiện cao cấp được tuyển
                chọn kỹ lưỡng để nâng tầm cuộc sống của bạn.
              </p>
            </div>
          )}
          <ProductPagination />
        </main>
      </div>
    </div>
  )
}
