'use client'

import { FolderPlus, Package, Plus } from 'lucide-react'

// Hooks
import { useAdminProducts } from '@/features/admin/products/hooks/useAdminProducts'

// Components
import ProductTable from '@/features/adminProduct/components/ProductTable'
import AddProductModal from '@/features/adminProduct/components/AddProductModal/AddProductModal'
import AddCategoryModal from '@/features/adminProduct/components/AddCategoryModal/AddCategoryModal'
import EditProductModal from '@/features/adminProduct/components/EditProductModal/EditProductModal'
import { Button } from '@/components/ui/button'
import { MeshBackground } from '@/components/common/MeshBackground'

export default function AdminProductsPage() {
  const {
    products,
    pagination,
    loading,
    error,
    refetch,
    categories,
    refetchCategories,
    keywordInput,
    setKeywordInput,
    categoryFilter,
    sortFilter,
    isProductModalOpen,
    setIsProductModalOpen,
    isCategoryModalOpen,
    setIsCategoryModalOpen,
    isEditModalOpen,
    handleEditProduct,
    handleCloseEditModal,
    selectedProduct,
    handlePageChange,
    handleSearchSubmit,
    handleCategoryChange,
    handleSortChange,
    handleResetFilters,
    params,
  } = useAdminProducts()

  return (
    <div className="relative isolate min-h-screen">
      <MeshBackground variant="admin" />

      <div className="mx-auto max-w-7xl px-4 py-4 md:px-6 md:py-8">
        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/50 px-4 py-1.5 text-[11px] font-black tracking-widest text-blue-600 uppercase backdrop-blur-sm dark:border-blue-900/30 dark:bg-blue-900/20 dark:text-blue-400">
              Quản lý kho hàng
            </div>
            <h1 className="font-display text-3xl font-black tracking-tight text-slate-900 sm:text-4xl dark:text-white">
              Sản phẩm &{' '}
              <span className="bg-linear-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Tồn kho
              </span>
            </h1>

            <p className="font-sans text-base text-slate-500 dark:text-slate-400">
              {params.keyword
                ? `Tìm thấy ${pagination?.totalItems || 0} kết quả cho "${params.keyword}"`
                : `Tổng số sản phẩm: ${pagination?.totalItems || 0}`}
            </p>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCategoryModalOpen(true)}
              className="rounded-full px-6 btn-premium-secondary"
            >
              <FolderPlus size={18} />
              Thêm danh mục
            </Button>

            <Button
              type="button"
              onClick={() => setIsProductModalOpen(true)}
              className="rounded-full px-8 btn-premium-primary shadow-lg shadow-blue-500/20"
            >
              <Plus size={18} />
              Thêm sản phẩm
            </Button>
          </div>
        </div>

        {error && (
          <p className="mb-4 text-sm text-red-500 bg-red-50 border border-red-100 p-3 rounded-xl">
            Không thể tải danh sách sản phẩm: {error}
          </p>
        )}

        {/* MAIN CONTENT */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <ProductTable
            products={products}
            loading={loading}
            pagination={pagination}
            categories={categories || []}
            keywordInput={keywordInput}
            categoryFilter={categoryFilter}
            sortFilter={sortFilter}
            onKeywordChange={setKeywordInput}
            onSearchSubmit={handleSearchSubmit}
            onCategoryChange={handleCategoryChange}
            onSortChange={handleSortChange}
            onResetFilters={handleResetFilters}
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
          onSaved={refetchCategories}
        />
      </div>
    </div>
  )
}
