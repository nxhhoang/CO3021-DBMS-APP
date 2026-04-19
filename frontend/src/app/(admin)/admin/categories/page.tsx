'use client'

import { Fragment, useEffect, useMemo, useState } from 'react'
import AddCategoryModal from '@/features/adminProduct/components/AddCategoryModal/AddCategoryModal'
import categoryService from '@/services/category.service'
import { Category } from '@/types/category.types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  ChevronRight,
  FolderPlus,
  FolderTree,
  Loader2,
  Pencil,
  Trash2,
} from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

function getCategoryId(category: Category) {
  return category._id || category.ID || ''
}

function getAttributeOptionsText(options?: Array<string | number | boolean>) {
  if (!Array.isArray(options) || options.length === 0) {
    return 'Không có'
  }

  return options.map((option) => String(option)).join(', ')
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  )
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(
    null,
  )
  const [updatingStatusIds, setUpdatingStatusIds] = useState<string[]>([])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await categoryService.getCategories({})
      setCategories(response.data ?? [])
    } catch (error) {
      console.error('Failed to fetch categories', error)
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const totalDynamicAttributes = useMemo(() => {
    return categories.reduce(
      (total, category) => total + category.dynamicAttributes.length,
      0,
    )
  }, [categories])

  const totalVariantAttributes = useMemo(() => {
    return categories.reduce(
      (total, category) => total + (category.variantAttributes?.length || 0),
      0,
    )
  }, [categories])

  const toggleCategoryDetails = (category: Category) => {
    const categoryId = getCategoryId(category)
    setExpandedCategoryId((current) =>
      current === categoryId ? null : categoryId,
    )
  }

  const openCreateModal = () => {
    setSelectedCategory(null)
    setIsCategoryModalOpen(true)
  }

  const openEditModal = (category: Category) => {
    setSelectedCategory(category)
    setIsCategoryModalOpen(true)
  }

  const handleSavedCategory = async () => {
    setIsCategoryModalOpen(false)
    setSelectedCategory(null)
    await fetchCategories()
  }

  const handleCloseModal = () => {
    setIsCategoryModalOpen(false)
    setSelectedCategory(null)
  }

  const handleDeleteCategory = async (category: Category) => {
    const categoryId = getCategoryId(category)

    if (!categoryId) {
      return
    }

    try {
      await categoryService.deleteCategory(categoryId)
      await fetchCategories()
    } catch (error) {
      console.error('Failed to delete category', error)
    }
  }

  const handleToggleCategoryStatus = async (
    category: Category,
    nextChecked: boolean,
  ) => {
    const categoryId = getCategoryId(category)

    if (!categoryId) {
      return
    }

    setUpdatingStatusIds((current) => [...current, categoryId])

    try {
      await categoryService.updateCategory(categoryId, {
        isActive: nextChecked,
      })

      setCategories((current) =>
        current.map((item) =>
          getCategoryId(item) === categoryId
            ? {
                ...item,
                isActive: nextChecked,
              }
            : item,
        ),
      )
    } catch (error) {
      console.error('Failed to update category status', error)
    } finally {
      setUpdatingStatusIds((current) =>
        current.filter((id) => id !== categoryId),
      )
    }
  }

  return (
    <div className="bg-surface min-h-screen px-6 py-8">
      <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <h1 className="text-on-surface flex items-center gap-3 text-3xl font-extrabold">
            <FolderTree className="text-primary" size={28} />
            Quản lý danh mục
          </h1>

          <p className="text-on-surface-variant text-sm">
            Tổng số danh mục: {categories.length} | Thuộc tính động:{' '}
            {totalDynamicAttributes} | Thuộc tính biến thể:{' '}
            {totalVariantAttributes}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={openCreateModal}
            className="text-on-primary bg-primary hover:bg-primary/90 flex items-center gap-2 rounded-full px-8 py-3 text-sm font-bold text-white transition"
          >
            <FolderPlus size={18} />
            Thêm danh mục
          </button>
        </div>
      </div>

      <div className="bg-surface-container-lowest border-outline-variant/10 overflow-hidden rounded-xl border shadow-sm">
        {loading ? (
          <div className="text-on-surface-variant flex h-40 items-center justify-center gap-2 text-sm">
            <Loader2 className="h-4 w-4 animate-spin" />
            Đang tải danh mục...
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12" />
                <TableHead className="w-60">Danh mục</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead className="w-35">Trạng thái</TableHead>
                <TableHead className="w-52">Thuộc tính</TableHead>
                <TableHead className="w-28 text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {categories.length ? (
                categories.map((category) => {
                  const categoryId = getCategoryId(category)
                  const variantAttributes = category.variantAttributes || []
                  const isExpanded = expandedCategoryId === categoryId
                  const isUpdatingStatus =
                    updatingStatusIds.includes(categoryId)

                  return (
                    <Fragment key={categoryId}>
                      <TableRow
                        onClick={() => toggleCategoryDetails(category)}
                        className="cursor-pointer transition-colors hover:bg-slate-50/30"
                      >
                        <TableCell>
                          <ChevronRight
                            className={`text-on-surface-variant h-4 w-4 transition-transform duration-200 ${
                              isExpanded ? 'rotate-90' : 'rotate-0'
                            }`}
                          />
                        </TableCell>

                        <TableCell className="max-w-60 whitespace-normal">
                          <div className="space-y-1">
                            <p className="text-on-surface font-semibold">
                              {category.name}
                            </p>
                            <p className="text-on-surface-variant text-xs">
                              {category.description || 'Không có mô tả'}
                            </p>
                          </div>
                        </TableCell>

                        <TableCell>{category.slug}</TableCell>

                        <TableCell onClick={(event) => event.stopPropagation()}>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={category.isActive}
                              disabled={isUpdatingStatus}
                              onCheckedChange={(checked) =>
                                handleToggleCategoryStatus(category, checked)
                              }
                            />
                            <Badge
                              variant={
                                category.isActive ? 'default' : 'secondary'
                              }
                              className="text-[10px]"
                            >
                              {isUpdatingStatus
                                ? 'Đang cập nhật...'
                                : category.isActive
                                  ? 'Đang hoạt động'
                                  : 'Tạm ẩn'}
                            </Badge>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="text-on-surface-variant text-xs">
                            Động: {category.dynamicAttributes.length} | Biến
                            thể: {variantAttributes.length}
                          </div>
                        </TableCell>

                        <TableCell
                          className="text-right"
                          onClick={(event) => event.stopPropagation()}
                        >
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditModal(category)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Xác nhận xóa danh mục
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Bạn có chắc chắn muốn xóa danh mục &quot;
                                    {category.name}&quot;? Hành động này không
                                    thể hoàn tác.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-red-500 hover:bg-red-600"
                                    onClick={() =>
                                      handleDeleteCategory(category)
                                    }
                                  >
                                    Xác nhận
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>

                      {isExpanded ? (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="bg-surface-container-low px-4 py-4"
                          >
                            <div className="animate-in fade-in-0 slide-in-from-top-1 grid gap-4 duration-200 lg:grid-cols-2">
                              <div className="rounded-lg border border-slate-200/50 p-4">
                                <p className="text-on-surface mb-3 text-sm font-semibold">
                                  Thuộc tính động (
                                  {category.dynamicAttributes.length})
                                </p>

                                {category.dynamicAttributes.length ? (
                                  <div className="space-y-3">
                                    {category.dynamicAttributes.map(
                                      (attribute) => (
                                        <div
                                          key={attribute.key}
                                          className="rounded-md border border-slate-200/40 p-3"
                                        >
                                          <div className="mb-2 flex items-center gap-2">
                                            <p className="text-on-surface text-sm font-medium">
                                              {attribute.label}
                                            </p>
                                            <Badge
                                              variant="outline"
                                              className="text-[10px] uppercase"
                                            >
                                              {attribute.dataType}
                                            </Badge>
                                          </div>

                                          <p className="text-on-surface-variant text-xs">
                                            key: {attribute.key}
                                          </p>

                                          <p className="text-on-surface-variant mt-1 text-xs">
                                            Options:{' '}
                                            {getAttributeOptionsText(
                                              attribute.options,
                                            )}
                                          </p>
                                        </div>
                                      ),
                                    )}
                                  </div>
                                ) : (
                                  <p className="text-on-surface-variant text-xs">
                                    Chưa có thuộc tính động.
                                  </p>
                                )}
                              </div>

                              <div className="rounded-lg border border-slate-200/50 p-4">
                                <p className="text-on-surface mb-3 text-sm font-semibold">
                                  Thuộc tính biến thể (
                                  {variantAttributes.length})
                                </p>

                                {variantAttributes.length ? (
                                  <div className="space-y-3">
                                    {variantAttributes.map((attribute) => (
                                      <div
                                        key={attribute.key}
                                        className="rounded-md border border-slate-200/40 p-3"
                                      >
                                        <div className="mb-2 flex items-center gap-2">
                                          <p className="text-on-surface text-sm font-medium">
                                            {attribute.label}
                                          </p>
                                          <Badge
                                            variant="outline"
                                            className="text-[10px] uppercase"
                                          >
                                            {attribute.dataType}
                                          </Badge>
                                        </div>

                                        <p className="text-on-surface-variant text-xs">
                                          key: {attribute.key}
                                        </p>

                                        <p className="text-on-surface-variant mt-1 text-xs">
                                          Options:{' '}
                                          {getAttributeOptionsText(
                                            attribute.options,
                                          )}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-on-surface-variant text-xs">
                                    Chưa có thuộc tính biến thể.
                                  </p>
                                )}
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : null}
                    </Fragment>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-on-surface-variant py-8 text-center"
                  >
                    Chưa có danh mục nào.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
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
