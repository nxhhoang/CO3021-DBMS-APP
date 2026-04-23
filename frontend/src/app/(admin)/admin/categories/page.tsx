'use client'

import { FolderPlus, FolderTree } from 'lucide-react'

// Components & Hooks
import AddCategoryModal from '@/features/adminProduct/components/AddCategoryModal/AddCategoryModal'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { MeshBackground } from '@/components/common/MeshBackground'
import { LoadingState } from '@/components/common/LoadingState'
import { EmptyState } from '@/components/common/EmptyState'

// Refactored Sub-components
import { CategoryStats } from '@/features/admin/categories/components/CategoryStats'
import { CategoryRow } from '@/features/admin/categories/components/CategoryRow'
import { useAdminCategories } from '@/features/admin/categories/hooks/useAdminCategories'

export default function AdminCategoriesPage() {
  const {
    categories,
    loading,
    selectedCategory,
    isCategoryModalOpen,
    expandedCategoryId,
    updatingStatusIds,
    totalDynamicAttributes,
    totalVariantAttributes,
    getCategoryId,
    toggleCategoryDetails,
    openCreateModal,
    openEditModal,
    handleSavedCategory,
    handleCloseModal,
    handleDeleteCategory,
    handleToggleCategoryStatus,
  } = useAdminCategories()

  return (
    <div className="relative isolate min-h-screen">
      <MeshBackground variant="admin" />

      <div className="mx-auto max-w-7xl px-4 py-4 md:px-6 md:py-8 lg:px-12">
        <div className="animate-in fade-in slide-in-from-top-4 mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between duration-700">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
                <FolderTree className="text-slate-900" size={26} />
              </div>
              <h1 className="font-display text-3xl font-black tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                Quản lý{' '}
                <span className="bg-linear-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  Danh mục
                </span>
              </h1>
            </div>
            <CategoryStats
              totalCategories={categories.length}
              totalDynamicAttributes={totalDynamicAttributes}
              totalVariantAttributes={totalVariantAttributes}
            />
          </div>

          <button
            onClick={openCreateModal}
            className="btn-premium-primary flex h-14 items-center gap-3 px-8 shadow-2xl transition-all hover:scale-105 active:scale-95"
          >
            <FolderPlus size={20} />
            <span>Thêm danh mục</span>
          </button>
        </div>

        <div className="glass-card animate-in fade-in slide-in-from-bottom-4 relative z-10 overflow-hidden border-slate-200 bg-white/40 p-0 shadow-2xl backdrop-blur-xl duration-700">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <LoadingState message="Đang tải danh mục..." />
            </div>
          ) : categories.length === 0 ? (
            <EmptyState
              icon={FolderTree}
              title="Chưa có danh mục nào"
              description="Hãy bắt đầu bằng cách thêm danh mục mới để phân loại sản phẩm của bạn."
              action={{ label: 'Thêm danh mục', onClick: openCreateModal }}
            />
          ) : (
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-16" />
                  <TableHead className="font-display py-6 text-xs font-black tracking-widest text-slate-400 uppercase">
                    Danh mục
                  </TableHead>
                  <TableHead className="font-display text-xs font-black tracking-widest text-slate-400 uppercase">
                    Slug
                  </TableHead>
                  <TableHead className="font-display text-xs font-black tracking-widest text-slate-400 uppercase">
                    Trạng thái
                  </TableHead>
                  <TableHead className="font-display text-xs font-black tracking-widest text-slate-400 uppercase">
                    Cấu trúc
                  </TableHead>
                  <TableHead className="font-display text-right text-xs font-black tracking-widest text-slate-400 uppercase">
                    Thao tác
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {categories.map((category) => {
                  const categoryId = getCategoryId(category)
                  return (
                    <CategoryRow
                      key={categoryId}
                      category={category}
                      categoryId={categoryId}
                      isExpanded={expandedCategoryId === categoryId}
                      isUpdatingStatus={updatingStatusIds.includes(categoryId)}
                      onToggleExpand={() => toggleCategoryDetails(category)}
                      onToggleStatus={(checked) =>
                        handleToggleCategoryStatus(category, checked)
                      }
                      onEdit={() => openEditModal(category)}
                      onDelete={() => handleDeleteCategory(category)}
                    />
                  )
                })}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      <AddCategoryModal
        isOpen={isCategoryModalOpen}
        category={selectedCategory}
        onClose={handleCloseModal}
        onSaved={handleSavedCategory}
      />
    </div>
  )
}
