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
import { cn } from '@/lib/utils'

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
              className={cn(
                'flex h-10 w-10 cursor-pointer items-center justify-center rounded-full font-mono text-sm font-bold transition-all active:scale-90',
                currentPage === i
                  ? 'bg-slate-900 text-white shadow-lg'
                  : 'border-transparent hover:bg-white hover:shadow-sm',
              )}
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
            <PaginationEllipsis className="h-10 w-10" />
          </PaginationItem>,
        )
      }
    }

    return items
  }

  return (
    <div className="glass-container flex flex-col items-center justify-between gap-6 sm:flex-row sm:px-10">
      <div className="flex items-center gap-3">
        <div className="h-1.5 w-6 rounded-full bg-blue-600" />
        <p className="font-display text-[11px] font-black tracking-widest text-slate-400 uppercase">
          Hiển thị{' '}
          <span className="font-mono text-slate-900 dark:text-white">
            {pagination.itemCount}
          </span>{' '}
          / {pagination.totalItems} sản phẩm
        </p>
      </div>

      <Pagination className="mx-0 w-auto">
        <PaginationContent className="gap-2">
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(event) => {
                event.preventDefault()
                if (currentPage > 1) onPageChange(currentPage - 1)
              }}
              className={`h-10 w-10 rounded-full border-slate-200 p-0 transition-all active:scale-90 ${
                currentPage <= 1
                  ? 'pointer-events-none opacity-20'
                  : 'cursor-pointer shadow-sm hover:bg-white'
              }`}
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
              className={`h-10 w-10 rounded-full border-slate-200 p-0 transition-all active:scale-90 ${
                !hasNextPage
                  ? 'pointer-events-none opacity-20'
                  : 'cursor-pointer shadow-sm hover:bg-white'
              }`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
