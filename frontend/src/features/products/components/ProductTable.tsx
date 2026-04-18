'use client'

import Image from 'next/image'
import { Edit2, Trash2, Box, Loader2, Star } from 'lucide-react'
import { toast } from 'sonner'

import { ProductResponse } from '@/types/product.types'
import { PaginationParams } from '@/types/api.types'
import { productService } from '@/services/product.service'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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

interface ProductTableProps {
  products: ProductResponse[]
  loading: boolean
  pagination: PaginationParams | null
  onRefresh: () => void
  onEdit: (product: ProductResponse) => void
  onPageChange: (page: number) => void
}

export default function ProductTable({
  products,
  loading,
  pagination,
  onRefresh,
  onEdit,
  onPageChange,
}: ProductTableProps) {
  const handleDelete = async (id: string) => {
    try {
      const response = await productService.deleteProduct({ id })
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-bold">Danh sách sản phẩm</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-md border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b transition-colors">
                <th className="text-muted-foreground h-12 px-4 text-left font-medium">
                  Sản phẩm
                </th>
                <th className="text-muted-foreground h-12 px-4 text-left font-medium">
                  Danh mục
                </th>
                <th className="text-muted-foreground h-12 px-4 text-right font-medium">
                  Giá cơ bản
                </th>
                <th className="text-muted-foreground h-12 px-4 text-center font-medium">
                  Đã bán
                </th>
                <th className="text-muted-foreground h-12 px-4 text-center font-medium">
                  Đánh giá
                </th>
                <th className="text-muted-foreground h-12 px-4 text-right font-medium">
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
                    className="hover:bg-muted/50 border-b transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border">
                          <Image
                            src={
                              product.images?.[0] ?? '/placeholder-product.png'
                            }
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="max-w-50">
                          <p
                            className="truncate text-sm font-medium"
                            title={product.name}
                          >
                            {product.name}
                          </p>
                          <p className="text-muted-foreground font-mono text-[10px]">
                            ID: {product._id.slice(-6).toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-left">
                      <Badge
                        variant="secondary"
                        className="text-[10px] font-normal uppercase"
                      >
                        {product.category.name}
                      </Badge>
                    </td>
                    <td className="p-4 text-right font-semibold">
                      {product.basePrice.toLocaleString()}đ
                    </td>
                    <td className="p-4 text-center font-medium">
                      {product.totalSold}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-1">
                        <Star
                          className="fill-yellow-500 text-yellow-500"
                          size={14}
                        />
                        <span className="font-medium">{product.avgRating}</span>
                        <span className="text-muted-foreground/60 text-[11px]">
                          ({product.totalReviews})
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(product)}
                        >
                          <Edit2 className="h-4 w-4" />
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
                                Xác nhận xóa sản phẩm
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Bạn có chắc chắn muốn ngừng bán sản phẩm &quot;
                                {product.name}&quot;? Hành động này không thể
                                hoàn tác.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Hủy</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-500 hover:bg-red-600"
                                onClick={() => handleDelete(product._id)}
                              >
                                Xác nhận
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

        {/* FOOTER & PAGINATION */}
        <div className="mt-4 flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-muted-foreground text-xs italic">
            Hiển thị {pagination?.itemCount ?? 0} trên{' '}
            {pagination?.totalItems ?? 0} sản phẩm
          </p>

          {pagination && pagination.totalPages > 1 && (
            <Pagination className="mx-0 w-auto">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (pagination.currentPage > 1)
                        onPageChange(pagination.currentPage - 1)
                    }}
                    className={
                      pagination.currentPage <= 1
                        ? 'pointer-events-none opacity-50'
                        : 'cursor-pointer'
                    }
                  />
                </PaginationItem>

                {renderPaginationItems()}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (pagination.hasNextPage)
                        onPageChange(pagination.currentPage + 1)
                    }}
                    className={
                      !pagination.hasNextPage
                        ? 'pointer-events-none opacity-50'
                        : 'cursor-pointer'
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </CardContent>
    </Card>
  )
}