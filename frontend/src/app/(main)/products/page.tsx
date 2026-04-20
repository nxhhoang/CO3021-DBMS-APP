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
    <div className="container mx-auto min-h-screen px-4 py-6 md:py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          {params.keyword ? (
            <>
              <h1 className="text-2xl font-semibold">
                {message}{' '}
                <span className="text-primary italic">
                  &quot;{params.keyword}&quot;
                </span>
              </h1>
              <p className="text-muted-foreground mt-1 text-sm">
                Tìm thấy {products.length} sản phẩm phù hợp
              </p>
            </>
          ) : (
            <h1 className="text-2xl font-semibold">Danh sách sản phẩm</h1>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-6 md:flex-row lg:gap-8">
        <div className="shrink-0">
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

        <div className="flex-1">
          <ProductList products={products} loading={loading} />
          <ProductPagination
            pagination={pagination}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  )
}
