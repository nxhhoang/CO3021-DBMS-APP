'use client'

import { PaginationParams } from '@/types'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

interface ProductPaginationProps {
  pagination: PaginationParams | null
  onPageChange: (page: number) => void
}

export default function ProductPagination({
  pagination,
  onPageChange,
}: ProductPaginationProps) {
  if (!pagination) return null

  const { currentPage, totalPages, hasNextPage } = pagination

  if (totalPages <= 1) return null

  const renderPageItems = () => {
    const items = []
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
              onClick={(event) => {
                event.preventDefault()
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
    <div className="bg-card mt-6 flex flex-col items-center justify-between gap-4 rounded-lg border p-3 sm:flex-row">
      <p className="text-muted-foreground text-xs italic">
        Hiển thị {pagination.itemCount} trên {pagination.totalItems} sản phẩm
      </p>

      <Pagination className="mx-0 w-auto">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(event) => {
                event.preventDefault()
                if (currentPage > 1) onPageChange(currentPage - 1)
              }}
              className={
                currentPage <= 1
                  ? 'pointer-events-none opacity-50'
                  : 'cursor-pointer'
              }
            />
          </PaginationItem>

          {renderPageItems()}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(event) => {
                event.preventDefault()
                if (hasNextPage) onPageChange(currentPage + 1)
              }}
              className={
                !hasNextPage
                  ? 'pointer-events-none opacity-50'
                  : 'cursor-pointer'
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
