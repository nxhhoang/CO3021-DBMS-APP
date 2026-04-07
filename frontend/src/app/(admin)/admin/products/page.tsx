'use client'

import { useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Plus, FolderPlus, Package } from 'lucide-react'

// Types & Hooks
import { GetProductsRequest, ProductResponse } from '@/types/product.types'
import useProducts from '@/features/products/hooks/useProducts'
import useProductQueryParams from '@/features/products/hooks/useProductQueryParams'
import useProductFilters from '@/features/products/hooks/useProductFilters'
import useCategories from '@/features/products/hooks/useCategories'

// Components
import ProductTable from '@/features/products/components/ProductTable'
import FilterSidebar from '@/features/products/components/FilterSidebar'
import AddProductModal from '@/features/products/components/AddProductModal/AddProductModal'
import AddCategoryModal from '@/features/products/components/AddCategoryModal/AddCategoryModal'
import EditProductModal from '@/features/products/components/EditProductModal/EditProductModal'

// shadcn
import { Button } from '@/components/ui/button'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

export default function AdminProductsPage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const params: GetProductsRequest = useProductQueryParams()
  const { products, pagination, loading, refetch } = useProducts(params)
  const { categories } = useCategories()
  const { priceRange, setPriceRange, sort, setSort } = useProductFilters(params)

  // State cho việc đóng/mở Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)

  // State quản lý việc sửa sản phẩm
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] =
    useState<ProductResponse | null>(null)

  // Handler mở modal sửa và truyền dữ liệu sản phẩm vào
  const handleEditProduct = (product: ProductResponse) => {
    setSelectedProduct(product)
    setIsEditModalOpen(true)
  }

  // Handler đóng modal sửa và dọn dẹp state
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
    setSelectedProduct(null)
  }

  const updatePage = (page: number) => {
    if (!pagination) return
    if (page < 1 || page > pagination.totalPages) return

    const nextParams = new URLSearchParams(searchParams.toString())
    nextParams.set('page', String(page))
    router.push(`${pathname}?${nextParams.toString()}`)
  }

  const getVisiblePages = () => {
    if (!pagination) return []

    const totalPages = pagination.totalPages
    const currentPage = pagination.currentPage
    const pages: Array<number | 'ellipsis'> = []

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
      return pages
    }

    pages.push(1)

    if (currentPage > 3) pages.push('ellipsis')

    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i)
    }

    if (currentPage < totalPages - 2) pages.push('ellipsis')

    pages.push(totalPages)

    return pages
  }

  const visiblePages = getVisiblePages()

  return (
    <div className="container mx-auto min-h-screen px-4 py-6 md:py-10">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <Package className="text-primary" size={28} />
            Quản lý kho hàng
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {params.keyword ? (
              <span>
                Tìm thấy {products.length} kết quả cho "{params.keyword}"
              </span>
            ) : (
              `Danh sách sản phẩm (${products.length})`
            )}
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

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar */}
        <aside className="w-full shrink-0 lg:w-72">
          <div className="sticky top-6">
            <FilterSidebar
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              sort={sort}
              setSort={setSort}
              categories={categories || []}
            />
          </div>
        </aside>

        {/* Main Table */}
        <main className="min-w-0 flex-1">
          <ProductTable
            products={products}
            loading={loading}
            onRefresh={refetch}
            onEdit={handleEditProduct} // Truyền handler sửa vào table
          />

          {pagination && pagination.totalPages > 1 && (
            <div className="mt-6 flex flex-col items-center gap-3">
              <p className="text-muted-foreground text-sm">
                Trang {pagination.currentPage}/{pagination.totalPages} - Tổng{' '}
                {pagination.totalItems} sản phẩm
              </p>

              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(event) => {
                        event.preventDefault()
                        if (pagination.hasPreviousPage) {
                          updatePage(pagination.currentPage - 1)
                        }
                      }}
                      className={
                        !pagination.hasPreviousPage
                          ? 'pointer-events-none opacity-50'
                          : ''
                      }
                    />
                  </PaginationItem>

                  {visiblePages.map((page, index) =>
                    page === 'ellipsis' ? (
                      <PaginationItem key={`ellipsis-${index}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          isActive={page === pagination.currentPage}
                          onClick={(event) => {
                            event.preventDefault()
                            updatePage(page)
                          }}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ),
                  )}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(event) => {
                        event.preventDefault()
                        if (pagination.hasNextPage) {
                          updatePage(pagination.currentPage + 1)
                        }
                      }}
                      className={
                        !pagination.hasNextPage
                          ? 'pointer-events-none opacity-50'
                          : ''
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </main>
      </div>

      {/* --- Modals Section --- */}

      {/* Thêm mới sản phẩm */}
      <AddProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        categories={categories || []}
      />

      {/* Cập nhật sản phẩm */}
      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        product={selectedProduct}
        categories={categories || []}
        onSuccess={refetch} // Load lại danh sách sau khi lưu thành công
      />

      {/* Thêm mới danh mục */}
      <AddCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
      />
    </div>
  )
}
