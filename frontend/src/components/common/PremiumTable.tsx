'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface PremiumTableProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

/**
 * PremiumTableContainer provides a unified wrapper with a glass effect,
 * header area (title/subtitle/actions), and proper overflow handling.
 */
export const PremiumTableContainer = ({
  children,
  className,
  title,
  subtitle,
  actions,
  ...props
}: PremiumTableProps & {
  title?: string
  subtitle?: string
  actions?: React.ReactNode
}) => {
  return (
    <div className={cn('table-container-premium', className)} {...props}>
      {(title || subtitle || actions) && (
        <div className="flex flex-col gap-4 border-b border-slate-100 bg-slate-50/30 px-8 py-6 md:flex-row md:items-center md:justify-between dark:border-white/5 dark:bg-white/5">
          <div className="space-y-1">
            {title && (
              <h2 className="font-display text-lg font-black tracking-tight text-slate-900 dark:text-white">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="font-sans text-xs font-medium text-slate-500 dark:text-slate-400">
                {subtitle}
              </p>
            )}
          </div>
          {actions && <div className="flex items-center gap-3">{actions}</div>}
        </div>
      )}
      <div className="overflow-x-auto">{children}</div>
    </div>
  )
}

export const PremiumTable = ({
  children,
  className,
  ...props
}: PremiumTableProps) => {
  return (
    <Table className={cn('w-full', className)} {...props}>
      {children}
    </Table>
  )
}

export const PremiumTableHeader = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) => {
  return (
    <TableHeader className={cn('bg-slate-50/50 dark:bg-white/5', className)} {...props}>
      {children}
    </TableHeader>
  )
}

export const PremiumTableHead = ({
  children,
  className,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) => {
  return (
    <TableHead
      className={cn('table-header-premium', className)}
      {...props}
    >
      {children}
    </TableHead>
  )
}

export const PremiumTableRow = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>) => {
  return (
    <TableRow
      className={cn('table-row-premium', className)}
      {...props}
    >
      {children}
    </TableRow>
  )
}

export const PremiumTableCell = ({
  children,
  className,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) => {
  return (
    <TableCell className={cn('table-cell-premium', className)} {...props}>
      {children}
    </TableCell>
  )
}
