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
      {/* BACKGROUND SYSTEM */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-linear-to-b from-slate-50 via-white to-slate-100" />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(148, 163, 184, 0.4) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(148, 163, 184, 0.4) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-[10%] -left-[5%] h-[500px] w-[500px] rounded-full bg-slate-200/20 blur-[120px]" />
          <div className="absolute top-[20%] -right-[10%] h-[600px] w-[600px] rounded-full bg-blue-50/10 blur-[140px]" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,white_90%)] opacity-40" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        <div className="mb-10">
          {params.keyword ? (
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 lg:text-4xl">
                Kết quả tìm kiếm
              </h1>
              <p className="text-slate-500">
                {message}{' '}
                <span className="text-blue-600 font-semibold">
                  &quot;{params.keyword}&quot;
                </span>
                <span className="ml-2 text-sm text-slate-400">
                  ({products.length} sản phẩm)
                </span>
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 lg:text-4xl">
                Danh sách sản phẩm
              </h1>
              <p className="text-slate-500 max-w-2xl">
                Khám phá những thiết bị công nghệ mới nhất được tuyển chọn kỹ lưỡng.
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-8 lg:flex-row xl:gap-10">
          <div className="lg:w-64 shrink-0">
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

          <div className="flex-1 space-y-10">
            <ProductList products={products} loading={loading} />
            <ProductPagination
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
