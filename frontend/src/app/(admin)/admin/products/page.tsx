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
import AddProductModal from '@/features/products/components/AddProductModal/AddProductModal'
import AddCategoryModal from '@/features/products/components/AddCategoryModal/AddCategoryModal'
import EditProductModal from '@/features/products/components/EditProductModal/EditProductModal'

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
    router.push(`${pathname}?${nextParams.toString()}`)
  }

  return (
    <div className="container mx-auto min-h-screen px-4 py-6 md:py-10">
      {/* Header Section */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <Package className="text-primary" size={28} />
            Quản lý kho hàng
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {params.keyword
              ? `Tìm thấy ${pagination?.totalItems || 0} kết quả cho "${params.keyword}"`
              : `Tổng số sản phẩm: ${pagination?.totalItems || 0}`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
            onClick={() => setIsCategoryModalOpen(true)}
          >
            <FolderPlus className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Thêm danh mục</span>
          </Button>

          <Button onClick={() => setIsProductModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm sản phẩm
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col gap-8 lg:flex-row">
        <main className="min-w-0 flex-1">
          <ProductTable
            products={products}
            loading={loading}
            pagination={pagination!} // Sử dụng type non-null vì hook luôn trả về pagination mặc định
            onRefresh={refetch}
            onEdit={handleEditProduct}
            onPageChange={handlePageChange}
          />
        </main>
      </div>

      {/* --- Modals --- */}
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