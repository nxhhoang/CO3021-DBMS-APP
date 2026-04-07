'use client'

import Image from 'next/image'
import { Edit2, Trash2, Box, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { ProductResponse } from '@/types/product.types'
import { PaginationParams } from '@/types/api.types'
import { productService } from '@/services/product.service'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
    if (!pagination) return []
    const items = []
    const { currentPage, totalPages } = pagination

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              isActive={currentPage === i}
              onClick={(e) => {
                e.preventDefault()
                onPageChange(i)
              }}
            >
              {i}
            </PaginationLink>
          </PaginationItem>,
        )
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        items.push(
          <PaginationItem key={i}>
            <PaginationEllipsis />
          </PaginationItem>,
        )
      }
    }
    return items
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Loader */}
      {loading && (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}

      {/* Table */}
      {products.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sản phẩm</TableHead>
              <TableHead>Danh mục</TableHead>
              <TableHead>Giá cơ bản</TableHead>
              <TableHead className="text-center">Đã bán</TableHead>
              <TableHead className="text-center">Đánh giá</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product._id}>
                <TableCell>
                  <div className="flex items-center gap-4">
                    <div className="relative h-12 w-12 overflow-hidden rounded-lg border">
                      <Image
                        src={product.images?.[0] ?? '/placeholder-product.png'}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="max-w-50">
                      <p className="truncate font-medium" title={product.name}>
                        {product.name}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        ID: {product._id.slice(-6)}
                      </p>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <Badge variant="secondary">{product.category.name}</Badge>
                </TableCell>

                <TableCell className="font-semibold">
                  {product.basePrice.toLocaleString()}đ
                </TableCell>
                <TableCell className="text-center">
                  {product.totalSold}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span className="font-medium">
                      {product.avgRating}
                      <span className="text-muted-foreground/60 ml-1 text-sm font-normal">
                        ({product.totalReviews})
                      </span>
                    </span>
                  </div>
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
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
                            Bạn có chắc chắn muốn ngừng bán sản phẩm "
                            {product.name}"? Hành động này không thể hoàn tác.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Hủy</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-500 hover:bg-red-600"
                            onClick={() => handleDelete(product._id)}
                          >
                            Xóa
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-muted-foreground flex flex-col items-center justify-center py-20">
          <Box className="mb-4 h-12 w-12 opacity-30" />
          <p>Không tìm thấy sản phẩm nào trong kho</p>
        </div>
      )}

      {/* Pagination luôn xuất hiện */}
      <div className="flex items-center justify-between border-t p-4">
        <p className="text-muted-foreground text-sm">
          Hiển thị {pagination?.itemCount ?? 0} trên{' '}
          {pagination?.totalItems ?? 0} sản phẩm
        </p>
        <Pagination className="mx-0 w-auto">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (pagination?.hasPreviousPage)
                    onPageChange((pagination.currentPage ?? 1) - 1)
                }}
                className={
                  !pagination?.hasPreviousPage
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
                  if (pagination?.hasNextPage)
                    onPageChange((pagination.currentPage ?? 1) + 1)
                }}
                className={
                  !pagination?.hasNextPage
                    ? 'pointer-events-none opacity-50'
                    : 'cursor-pointer'
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}