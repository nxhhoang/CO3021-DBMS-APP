'use client'

import { FormEvent } from 'react'
import Image from 'next/image'
import {
  Box,
  Edit2,
  Loader2,
  RotateCcw,
  Search,
  Star,
  Trash2,
} from 'lucide-react'
import { toast } from 'sonner'

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
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const ADMIN_SORT_OPTIONS = [
  { label: 'Bán chạy nhất', value: SORT_BY.POPULARITY },
  { label: 'Giá tăng dần', value: SORT_BY.PRICE_ASC },
  { label: 'Giá giảm dần', value: SORT_BY.PRICE_DESC },
  { label: 'Đánh giá cao', value: SORT_BY.RATING },
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

  const renderPaginationItems = () => {
    if (!pagination || pagination.totalPages <= 1) return []

    const items = []
    const { currentPage, totalPages } = pagination
    const delta = 1

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              isActive={currentPage === i}
              onClick={(e) => {
                e.preventDefault()
                if (currentPage !== i) onPageChange(i)
              }}
            >
              {i}
            </PaginationLink>
          </PaginationItem>,
        )
      } else if (
        i === currentPage - delta - 1 ||
        i === currentPage + delta + 1
      ) {
        items.push(
          <PaginationItem key={`ellipsis-${i}`}>
            <PaginationEllipsis />
          </PaginationItem>,
        )
      }
    }
    return items
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
          <div className="group relative">
            <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-500" />
            <Input
              value={keywordInput}
              onChange={(event) => onKeywordChange(event.target.value)}
              placeholder="Tìm kiếm theo tên hoặc mô tả..."
              className="h-12 rounded-xl border-slate-100 bg-white/80 pl-11 shadow-sm transition-all focus:bg-white focus:ring-2 focus:ring-indigo-100"
            />
          </div>

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

        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white/50 shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="h-14 px-6 text-left text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  Sản phẩm
                </th>
                <th className="h-14 px-6 text-left text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  Danh mục
                </th>
                <th className="h-14 px-6 text-right text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  Giá cơ bản
                </th>
                <th className="h-14 px-6 text-center text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  Thống kê
                </th>
                <th className="h-14 px-6 text-right text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="text-primary h-8 w-8 animate-spin" />
                      <p className="text-muted-foreground">
                        Đang tải dữ liệu...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : products.length > 0 ? (
                products.map((product) => (
                  <tr
                    key={product._id}
                    className="border-b border-slate-50 transition-colors hover:bg-slate-50/50"
                  >
                    <td className="px-6 py-5">
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
                    </td>
                    <td className="px-6 py-5">
                      <span className="glass-badge-blue inline-flex items-center rounded-full px-3 py-1 text-[10px] font-black uppercase">
                        {product.category?.name || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <p className="text-sm font-bold text-slate-900">
                        {product.basePrice.toLocaleString()}đ
                      </p>
                    </td>
                    <td className="px-6 py-5">
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
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => onEdit(product)}
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-100 bg-white text-slate-600 shadow-sm transition-all hover:border-indigo-100 hover:bg-indigo-50 hover:text-indigo-600 active:scale-90"
                        >
                          <Edit2 size={16} />
                        </button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-100 bg-white text-slate-400 shadow-sm transition-all hover:border-red-100 hover:bg-red-50 hover:text-red-500 active:scale-90">
                              <Trash2 size={16} />
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="rounded-3xl border-none shadow-2xl">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-xl font-bold">
                                Ngừng kinh doanh sản phẩm?
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-slate-500">
                                Sản phẩm &quot;{product.name}&quot; sẽ bị ẩn
                                khỏi cửa hàng. Bạn có thể kích hoạt lại sau
                                trong phần cài đặt.
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
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Box className="mb-4 h-12 w-12 opacity-20" />
                      <p className="text-muted-foreground">
                        Không tìm thấy sản phẩm nào trong kho
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      <div className="border-t border-slate-100 bg-slate-50/30 px-8 py-5">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            Hiển thị {pagination?.itemCount ?? 0} trên{' '}
            {pagination?.totalItems ?? 0} sản phẩm
          </p>

          {pagination && pagination.totalPages > 1 && (
            <Pagination className="mx-0 w-auto">
              <PaginationContent className="gap-1">
                <PaginationItem>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      if (pagination.currentPage > 1)
                        onPageChange(pagination.currentPage - 1)
                    }}
                    disabled={pagination.currentPage <= 1}
                    className="flex h-9 items-center gap-1 rounded-xl px-3 text-xs font-bold text-slate-600 transition-colors hover:bg-white hover:text-slate-900 disabled:opacity-30"
                  >
                    Trước
                  </button>
                </PaginationItem>

                {renderPaginationItems()}

                <PaginationItem>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      if (pagination.hasNextPage)
                        onPageChange(pagination.currentPage + 1)
                    }}
                    disabled={!pagination.hasNextPage}
                    className="flex h-9 items-center gap-1 rounded-xl px-3 text-xs font-bold text-slate-600 transition-colors hover:bg-white hover:text-slate-900 disabled:opacity-30"
                  >
                    Sau
                  </button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
    </div>
  </div>
)
}