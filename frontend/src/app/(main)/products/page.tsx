'use client'

import { GetProductsRequest } from '@/types/product.types'
import useProducts from '@/features/products/hooks/useProducts'
import ProductList from '@/features/products/components/ProductList'
import ProductPagination from '@/features/products/components/ProductPagination'
import FilterSidebar from '@/features/products/components/FilterSidebar'
import useProductQueryParams from '@/features/products/hooks/useProductQueryParams'
import useCategories from '@/features/products/hooks/useCategories'
import { useEffect, useMemo } from 'react'
import { getUserRole } from '../../../utils/getUserRole'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { DEFAULT_MAX_PRICE } from '@/constants/enum'

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

    // 🔥 Redirect nếu là ADMIN
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
    <div className="relative isolate min-h-screen w-full overflow-clip bg-white text-slate-900">
      {/* REUSABLE BACKGROUND SYSTEM */}
      <div className="mesh-gradient-container">
        <div className="mesh-gradient-base" />
        <div className="mesh-gradient-dots" />
        <div className="mesh-gradient-spotlight" />

        <div className="absolute inset-0 overflow-hidden">
          <div className="mesh-gradient-blob -top-[5%] left-[15%] h-[600px] w-[600px] bg-blue-300/20 blur-[120px] animate-pulse" />
          <div className="mesh-gradient-blob top-[10%] right-[10%] h-[500px] w-[500px] bg-cyan-300/20 blur-[100px]" />
          <div className="mesh-gradient-blob top-[40%] left-[5%] h-[400px] w-[400px] bg-sky-200/20 blur-[90px]" />
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,white_100%)] opacity-20" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 md:py-16">
        {/* HEADER SECTION */}
        <div className="mb-12">
          {params.keyword ? (
            <div className="space-y-4">
              <div className="glass-badge-blue">
                Kết quả tìm kiếm
              </div>
              <h1 className="font-display text-4xl font-bold tracking-tight text-slate-900 lg:text-5xl">
                &quot;{params.keyword}&quot;
              </h1>
              <p className="text-lg text-slate-500">
                {message} <span className="font-semibold text-slate-900">({pagination?.totalItems ?? 0} sản phẩm)</span>
              </p>
            </div>
          ) : (
            <div className="space-y-4 text-center md:text-left">
              <div className="glass-badge-blue">
                Cửa hàng trực tuyến
              </div>
              <h1 className="font-display text-4xl font-bold tracking-tight text-slate-900 lg:text-5xl">
                Khám phá{' '}
                <span className="text-gradient-primary">
                  Sản phẩm
                </span>
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-slate-500 md:mx-0">
                Tìm kiếm những thiết bị công nghệ và phụ kiện cao cấp được tuyển chọn kỹ lưỡng để nâng tầm cuộc sống của bạn.
              </p>
            </div>
          )}
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="flex flex-col gap-8 lg:flex-row xl:gap-12">
          {/* SIDEBAR FILTERS */}
          <div className="w-full lg:w-72 shrink-0">
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
              <div className="flex justify-center pt-8">
                <ProductPagination
                  pagination={pagination}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
