'use client'

import { GetProductsRequest } from '@/types/product.types'
import {
  useProducts,
  ProductList,
  FilterSidebar,
  useProductQueryParams,
  useCategories,
} from '@/features/products'
import { DataPagination } from '@/components/common/DataPagination'
import { useEffect, useMemo } from 'react'
import { getUserRole } from '../../../utils/getUserRole'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { DEFAULT_MAX_PRICE } from '@/constants/enum'
import PageBackground from '@/components/layout/PageBackground'

export default function ProductsPage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const params: GetProductsRequest = useProductQueryParams()
  const { products, loading, message, pagination } = useProducts(params)
  const { categories } = useCategories()

  const initialAttrs = useMemo(() => {
    const attrs: Record<string, string> = {}
    searchParams.forEach((value, key) => {
      const match = key.match(/^attrs\[(.*)\]$/)
      if (match) attrs[match[1]] = value
    })
    return attrs
  }, [searchParams])

  useEffect(() => {
    const userRole = getUserRole()
    if (userRole === 'ADMIN') {
      router.replace('/admin/products')
    }
  }, [router])

  const handlePageChange = (page: number) => {
    const nextParams = new URLSearchParams(searchParams.toString())
    nextParams.set('page', String(page))
    router.push(`${pathname}?${nextParams.toString()}`)
  }

  return (
    <PageBackground>
      <div className="container mx-auto px-4 py-8 md:py-16">
        {/* HEADER SECTION */}
        <div className="mb-12">
          {params.keyword ? (
            <div className="space-y-4">
              <div className="glass-badge-blue">Kết quả tìm kiếm</div>
              <h1 className="font-display text-4xl font-bold tracking-tight text-slate-900 lg:text-5xl">
                &quot;{params.keyword}&quot;
              </h1>
              <p className="text-lg text-slate-500">
                {message}{' '}
                <span className="font-semibold text-slate-900">
                  ({pagination?.totalItems ?? 0} sản phẩm)
                </span>
              </p>
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
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="flex flex-col gap-8 lg:flex-row xl:gap-12">
          {/* SIDEBAR FILTERS */}
          <div className="w-full shrink-0 lg:w-72">
            <FilterSidebar
              key={searchParams.toString()}
              initialCategory={params.category ?? 'all'}
              initialAttrs={initialAttrs}
              initialPriceRange={[
                params.priceMin ?? 0,
                params.priceMax ?? DEFAULT_MAX_PRICE,
              ]}
              initialSort={params.sort ?? ''}
              categories={categories || []}
            />
          </div>

          {/* PRODUCT GRID & PAGINATION */}
          <div className="flex-1 space-y-12">
            <ProductList products={products} loading={loading} />

            {pagination && pagination.totalPages > 1 && (
              <div className="pt-8">
                <DataPagination
                  variant="glass"
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  totalItems={pagination.totalItems}
                  itemCount={pagination.itemCount}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </PageBackground>
  )
}
