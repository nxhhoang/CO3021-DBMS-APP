'use client'

import { GetProductsRequest } from '@/types/product.types'
import useProducts from '@/features/products/hooks/useProducts'
import ProductList from '@/features/products/components/ProductList'
import FilterSidebar from '@/features/products/components/FilterSidebar'
import useProductQueryParams from '@/features/products/hooks/useProductQueryParams'
import useProductFilters from '@/features/products/hooks/useProductFilters'
import useCategories from '@/features/products/hooks/useCategories'
import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getUserRole } from '../../../utils/getUserRole'
// import AddProductModal from '@/features/products/components/AddProductModal/AddProductModal'
import { useRouter } from 'next/navigation'

export default function ProductsPage() {
  const router = useRouter()

  const params: GetProductsRequest = useProductQueryParams()
  const { products, loading, message } = useProducts(params)
  const { priceRange, setPriceRange, sort, setSort } = useProductFilters(params)
  const { categories } = useCategories()

  const [role, setRole] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const userRole = getUserRole()
    setRole(userRole)

    // 🔥 Redirect nếu là ADMIN
    if (userRole === 'ADMIN') {
      router.replace('/admin/products')
    }
  }, [router])

  const isAdmin = role === 'ADMIN'

  return (
    <div className="container mx-auto min-h-screen px-4 py-6 md:py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          {params.keyword ? (
            <>
              <h1 className="text-2xl font-semibold">
                {message}{' '}
                <span className="text-primary italic">"{params.keyword}"</span>
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

      <div className="flex flex-col gap-6 md:flex-row lg:gap-10">
        <div className="shrink-0">
          <FilterSidebar
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            sort={sort}
            setSort={setSort}
            categories={categories || []}
          />
        </div>

        <div className="flex-1">
          <ProductList products={products} loading={loading} />
        </div>
      </div>

      {/* <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categories={categories || []}
      /> */}
    </div>
  )
}
