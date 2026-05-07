'use client'

import React from 'react'
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

interface DataPaginationProps {
  currentPage: number
  totalPages: number
  totalItems?: number
  itemCount?: number
  label?: string
  onPageChange: (page: number) => void
  className?: string
  variant?: 'default' | 'glass' | 'minimal'
}

export const DataPagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemCount,
  label = 'sản phẩm',
  onPageChange,
  className,
  variant = 'default',
}: DataPaginationProps) => {
  if (totalPages <= 1) return null

  const renderPaginationItems = () => {
    const items = []
    const delta = variant === 'glass' ? 1 : 2

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              isActive={currentPage === i}
              onClick={(e) => {
                e.preventDefault()
                onPageChange(i)
              }}
              className={cn(
                'cursor-pointer transition-all active:scale-90',
                variant === 'glass' &&
                  'flex h-10 w-10 items-center justify-center rounded-full font-mono text-sm font-bold',
                variant === 'glass' &&
                  (currentPage === i
                    ? 'bg-slate-900 text-white shadow-lg'
                    : 'border-transparent hover:bg-white hover:shadow-sm'),
                variant === 'minimal' && 'h-8 w-8 text-xs',
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
            <PaginationEllipsis
              className={cn(variant === 'glass' && 'h-10 w-10')}
            />
          </PaginationItem>,
        )
      }
    }

    return items
  }

  const paginationContent = (
    <PaginationContent
      className={cn('gap-2', variant === 'minimal' && 'gap-1')}
    >
      <PaginationItem>
        <PaginationPrevious
          onClick={(e) => {
            e.preventDefault()
            if (currentPage > 1) onPageChange(currentPage - 1)
          }}
          className={cn(
            'transition-all active:scale-90',
            currentPage === 1
              ? 'pointer-events-none opacity-20'
              : 'cursor-pointer',
            variant === 'glass' &&
              'rounded-full border-slate-200 p-0 shadow-sm hover:bg-white',
            variant === 'minimal' && 'p-0',
          )}
        />
      </PaginationItem>

      {renderPaginationItems()}

      <PaginationItem>
        <PaginationNext
          onClick={(e) => {
            e.preventDefault()
            if (currentPage < totalPages) onPageChange(currentPage + 1)
          }}
          className={cn(
            'transition-all active:scale-90',
            currentPage === totalPages
              ? 'pointer-events-none opacity-20'
              : 'cursor-pointer',
            variant === 'glass' &&
              'rounded-full border-slate-200 p-0 shadow-sm hover:bg-white',
            variant === 'minimal' && 'p-0',
          )}
        />
      </PaginationItem>
    </PaginationContent>
  )

  if (variant === 'glass') {
    return (
      <div
        className={cn(
          'glass-container flex flex-col items-center justify-between gap-6 sm:flex-row sm:px-10',
          className,
        )}
      >
        <div className="flex items-center gap-3">
          <div className="h-1.5 w-6 rounded-full bg-blue-600" />
          <p className="font-display text-[11px] font-black tracking-widest text-slate-400 uppercase">
            Hiển thị{' '}
            <span className="font-mono text-slate-900 dark:text-white">
              {itemCount}
            </span>{' '}
            / {totalItems} {label}
          </p>
        </div>
        <Pagination className="mx-0 w-auto">{paginationContent}</Pagination>
      </div>
    )
  }

  if (variant === 'minimal') {
    return (
      <div className={cn('flex items-center justify-between px-2', className)}>
        {totalItems && (
          <p className="text-xs font-medium text-slate-500">
            Tổng cộng {totalItems} {label}
          </p>
        )}
        <Pagination className="mx-0 w-auto">{paginationContent}</Pagination>
      </div>
    )
  }

  return <Pagination className={className}>{paginationContent}</Pagination>
}
