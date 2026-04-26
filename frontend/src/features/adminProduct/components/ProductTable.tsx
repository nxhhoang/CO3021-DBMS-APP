'use client'

import { FormEvent } from 'react'
import Image from 'next/image'
import { Box, Edit2, Loader2, RotateCcw, Star, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { SearchBar } from '@/components/common/SearchBar'

import { ProductResponse } from '@/types/product.types'
import { PaginationParams } from '@/types/api.types'
import { productService } from '@/services/product.service'
import { Category } from '@/types/category.types'
import { SORT_BY } from '@/constants/enum'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
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
  PremiumTable,
  PremiumTableCell,
  PremiumTableHead,
  PremiumTableHeader,
  PremiumTableRow,
} from '@/components/common/PremiumTable'
import { DataPagination } from '@/components/common/DataPagination'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const ADMIN_SORT_OPTIONS = [
  { label: 'Bán chạy nhất', value: SORT_BY.SOLD_DESC },
  { label: 'Giá tăng dần', value: SORT_BY.PRICE_ASC },
  { label: 'Giá giảm dần', value: SORT_BY.PRICE_DESC },
  { label: 'Đánh giá cao', value: SORT_BY.RATING_DESC },
] as const

interface ProductTableProps {
  products: ProductResponse[]
  loading: boolean
  pagination: PaginationParams | null
  categories: Category[]
  keywordInput: string
  categoryFilter: string
  sortFilter: string
  onKeywordChange: (value: string) => void
  onSearchSubmit: (event: FormEvent<HTMLFormElement>) => void
  onCategoryChange: (value: string) => void
  onSortChange: (value: string) => void
  onResetFilters: () => void
  onRefresh: () => void
  onEdit: (product: ProductResponse) => void
  onPageChange: (page: number) => void
}

export default function ProductTable({
  products,
  loading,
  pagination,
  categories,
  keywordInput,
  categoryFilter,
  sortFilter,
  onKeywordChange,
  onSearchSubmit,
  onCategoryChange,
  onSortChange,
  onResetFilters,
  onRefresh,
  onEdit,
  onPageChange,
}: ProductTableProps) {
  const handleDelete = async (productId: string) => {
    try {
      const response = await productService.deleteProduct({ productId })
      if (response.data) {
        toast.success('Đã ngừng bán sản phẩm thành công')
        onRefresh()
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xóa sản phẩm')
      console.error(error)
    }
  }

  return (
    <div className="glass-card overflow-hidden border-white/40 bg-white/40 shadow-2xl backdrop-blur-xl">
      <div className="border-b border-slate-100 bg-slate-50/30 px-8 py-6">
        <h2 className="text-lg font-bold text-slate-900">Danh sách sản phẩm</h2>
      </div>

      <div className="p-8">
        <form
          onSubmit={onSearchSubmit}
          className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_200px_200px_auto_auto] lg:items-center"
        >
          <SearchBar
            variant="admin"
            value={keywordInput}
            onChange={onKeywordChange}
            placeholder="Tìm kiếm sản phẩm..."
            className="w-full"
          />

          <Select value={categoryFilter} onValueChange={onCategoryChange}>
            <SelectTrigger className="h-12 rounded-xl border-slate-100 bg-white/80 shadow-sm transition-all focus:ring-2 focus:ring-indigo-100">
              <SelectValue placeholder="Danh mục" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-100 shadow-xl">
              <SelectItem value="all">Tất cả danh mục</SelectItem>
              {categories.map((category) => (
                <SelectItem
                  key={category._id || category.ID}
                  value={category.slug}
                >
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortFilter} onValueChange={onSortChange}>
            <SelectTrigger className="h-12 rounded-xl border-slate-100 bg-white/80 shadow-sm transition-all focus:ring-2 focus:ring-indigo-100">
              <SelectValue placeholder="Sắp xếp" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-100 shadow-xl">
              {ADMIN_SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <button
            type="submit"
            className="flex h-12 items-center justify-center rounded-xl bg-slate-900 px-8 font-bold text-white transition-all hover:bg-black active:scale-95"
          >
            Áp dụng
          </button>

          <button
            type="button"
            onClick={onResetFilters}
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-all hover:bg-slate-50 hover:text-slate-900 active:scale-95"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </form>

        <PremiumTable>
          <PremiumTableHeader>
            <PremiumTableRow>
              <PremiumTableHead>Sản phẩm</PremiumTableHead>
              <PremiumTableHead>Danh mục</PremiumTableHead>
              <PremiumTableHead className="text-right">
                Giá cơ bản
              </PremiumTableHead>
              <PremiumTableHead className="text-center">
                Thống kê
              </PremiumTableHead>
              <PremiumTableHead className="text-right">
                Thao tác
              </PremiumTableHead>
            </PremiumTableRow>
          </PremiumTableHeader>
          <tbody>
            {loading ? (
              <PremiumTableRow>
                <PremiumTableCell colSpan={6} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 className="text-primary h-8 w-8 animate-spin" />
                    <p className="text-muted-foreground">Đang tải dữ liệu...</p>
                  </div>
                </PremiumTableCell>
              </PremiumTableRow>
            ) : products.length > 0 ? (
              products.map((product) => (
                <PremiumTableRow key={product._id}>
                  <PremiumTableCell>
                    <div className="flex items-center gap-4">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
                        <Image
                          src={
                            product.images?.[0] ?? '/placeholder-product.png'
                          }
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="max-w-64 space-y-1">
                        <p
                          className="truncate text-sm font-bold text-slate-900"
                          title={product.name}
                        >
                          {product.name}
                        </p>
                        <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                          ID: {product._id.slice(-8).toUpperCase()}
                        </p>
                      </div>
                    </div>
                  </PremiumTableCell>
                  <PremiumTableCell>
                    <span className="glass-badge-blue">
                      {product.category?.name || 'N/A'}
                    </span>
                  </PremiumTableCell>
                  <PremiumTableCell className="text-right">
                    <p className="text-sm font-bold text-slate-900">
                      {product.basePrice.toLocaleString()}đ
                    </p>
                  </PremiumTableCell>
                  <PremiumTableCell>
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-1.5">
                        <Star
                          className="fill-amber-400 text-amber-400"
                          size={12}
                        />
                        <span className="text-xs font-bold text-slate-700">
                          {product.avgRating}
                        </span>
                      </div>
                      <p className="text-[10px] font-medium text-slate-400">
                        {product.totalSold} đã bán • {product.totalReviews} HV
                      </p>
                    </div>
                  </PremiumTableCell>
                  <PremiumTableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onEdit(product)}
                        className="icon-box-premium h-9 w-9 hover:border-indigo-100 hover:bg-indigo-50 hover:text-indigo-600 active:scale-90"
                      >
                        <Edit2 size={16} />
                      </button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button className="icon-box-premium h-9 w-9 text-slate-400 hover:border-red-100 hover:bg-red-50 hover:text-red-500 active:scale-90">
                            <Trash2 size={16} />
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-3xl border-none shadow-2xl">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-xl font-bold">
                              Ngừng kinh doanh sản phẩm?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-slate-500">
                              Sản phẩm &quot;{product.name}&quot; sẽ bị ẩn khỏi
                              cửa hàng. Bạn có thể kích hoạt lại sau trong phần
                              cài đặt.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="mt-4">
                            <AlertDialogCancel className="rounded-xl border-slate-200">
                              Hủy bỏ
                            </AlertDialogCancel>
                            <AlertDialogAction
                              className="rounded-xl bg-red-500 font-bold text-white hover:bg-red-600"
                              onClick={() => handleDelete(product._id)}
                            >
                              Xác nhận ngừng bán
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </PremiumTableCell>
                </PremiumTableRow>
              ))
            ) : (
              <PremiumTableRow>
                <PremiumTableCell colSpan={6} className="py-20 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <Box className="mb-4 h-12 w-12 opacity-20" />
                    <p className="text-muted-foreground">
                      Không tìm thấy sản phẩm nào trong kho
                    </p>
                  </div>
                </PremiumTableCell>
              </PremiumTableRow>
            )}
          </tbody>
        </PremiumTable>

        <div className="border-t border-slate-100 bg-slate-50/30 px-8 py-5">
          {pagination && pagination.totalPages > 1 && (
            <DataPagination
              variant="minimal"
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalItems}
              onPageChange={onPageChange}
              className="w-full"
            />
          )}
        </div>
      </div>
    </div>
  )
}
