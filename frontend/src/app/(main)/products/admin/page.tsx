'use client'

import { GetProductsRequest } from '@/types/product.types'
import useProducts from '@/features/products/hooks/useProducts'
import ProductList from '@/features/products/components/ProductList'
import FilterSidebar from '@/features/products/components/FilterSidebar'
import useProductQueryParams from '@/features/products/hooks/useProductQueryParams'
import useProductFilters from '@/features/products/hooks/useProductFilters'
import useCategories from '@/features/products/hooks/useCategories'
import { Plus, FolderPlus } from 'lucide-react'
import { useEffect, useState } from 'react'
import AddProductModal from '@/features/products/components/AddProductModal/AddProductModal'
import AddCategoryModal from '@/features/products/components/AddCategoryModal/AddCategoryModal'

export default function ProductsPage() {
  const params: GetProductsRequest = useProductQueryParams()
  const { products, loading, message } = useProducts(params)
  const { priceRange, setPriceRange, sort, setSort } = useProductFilters(params)
  const { categories } = useCategories()

  // 1. Quản lý trạng thái role
  const [role, setRole] = useState<string | null>(null)

  // Quản lý trạng thái Modal
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)

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

        {/* Cụm nút điều hướng dành cho Admin */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-emerald-600 px-4 py-2 text-emerald-600 transition-colors hover:bg-emerald-50"
          >
            <FolderPlus size={20} />
            <span className="hidden sm:inline">Thêm danh mục</span>
          </button>

          <button
            onClick={() => setIsProductModalOpen(true)}
            className="bg-primary hover:bg-primary/90 flex items-center gap-2 rounded-lg px-4 py-2 text-white transition-colors"
          >
            <Plus size={20} />
            <span>Thêm sản phẩm</span>
          </button>
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

      {/* Render Modals */}
      <AddProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        categories={categories || []}
      />

      <AddCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
      />
    </div>
  )
}
