'use client'

import { useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Plus, FolderPlus, Package } from 'lucide-react'

// Types & Hooks
import { GetProductsRequest, ProductResponse } from '@/types/product.types'
import useProducts from '@/features/products/hooks/useProducts'
import useProductQueryParams from '@/features/products/hooks/useProductQueryParams'
import useCategories from '@/features/products/hooks/useCategories'

// Components
import ProductTable from '@/features/products/components/ProductTable'
import AddProductModal from '@/features/adminProduct/components/AddProductModal/AddProductModal'
import AddCategoryModal from '@/features/adminProduct/components/AddCategoryModal/AddCategoryModal'
import EditProductModal from '@/features/adminProduct/components/EditProductModal/EditProductModal'

// shadcn
import { Button } from '@/components/ui/button'

export default function AdminProductsPage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Data Fetching
  const params: GetProductsRequest = useProductQueryParams()
  const { products, pagination, loading, refetch } = useProducts(params)
  const { categories } = useCategories()

  // State Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] =
    useState<ProductResponse | null>(null)

  // Handlers
  const handleEditProduct = (product: ProductResponse) => {
    setSelectedProduct(product)
    setIsEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
    setSelectedProduct(null)
  }

  const handlePageChange = (page: number) => {
    const nextParams = new URLSearchParams(searchParams.toString())
    nextParams.set('page', String(page))
    router.push(`${pathname}?${nextParams.toString()}`, { scroll: false })
  }

  return (
    <div className="bg-surface min-h-screen px-6 py-8">
      {/* HEADER */}
      <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <h1 className="text-on-surface flex items-center gap-3 text-3xl font-extrabold">
            <Package className="text-primary" size={28} />
            Quản lý kho hàng
          </h1>

          <p className="text-on-surface-variant text-sm">
            {params.keyword
              ? `Tìm thấy ${pagination?.totalItems || 0} kết quả cho "${params.keyword}"`
              : `Tổng số sản phẩm: ${pagination?.totalItems || 0}`}
          </p>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="bg-surface-container-high text-primary hover:bg-surface-container-highest flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition"
          >
            <FolderPlus size={18} />
            Thêm danh mục
          </button>

          <button
            onClick={() => setIsProductModalOpen(true)}
            className="text-on-primary bg-primary hover:bg-primary/90 flex items-center gap-2 rounded-full px-8 py-3 text-sm font-bold text-white transition"
          >
            <Plus size={18} />
            Thêm sản phẩm
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="bg-surface-container-lowest border-outline-variant/10 overflow-hidden rounded-xl border shadow-sm">
        <ProductTable
          products={products}
          loading={loading}
          pagination={pagination!}
          onRefresh={refetch}
          onEdit={handleEditProduct}
          onPageChange={handlePageChange}
        />
      </div>

      {/* MODALS */}
      <AddProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        categories={categories || []}
        onSuccess={refetch}
      />

      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        product={selectedProduct}
        categories={categories || []}
        onSuccess={refetch}
      />

      <AddCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
      />
    </div>
  )
}