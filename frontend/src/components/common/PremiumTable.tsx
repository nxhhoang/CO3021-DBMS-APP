'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface PremiumTableProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const PremiumTable = ({ children, className, ...props }: PremiumTableProps) => {
  return (
    <div 
      className={cn(
        'overflow-hidden rounded-2xl border border-slate-100 bg-white/50 shadow-sm backdrop-blur-md',
        className
      )} 
      {...props}
    >
      <Table>{children}</Table>
    </div>
  );
};

export const PremiumTableHeader = ({ children, className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => {
  return (
    <TableHeader className={cn('bg-slate-50/50', className)} {...props}>
      {children}
    </TableHeader>
  );
};

export const PremiumTableHead = ({ children, className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) => {
  return (
    <TableHead 
      className={cn(
        'h-14 px-6 text-left text-[10px] font-black tracking-widest uppercase text-slate-400',
        className
      )} 
      {...props}
    >
      {children}
    </TableHead>
  );
};

export const PremiumTableRow = ({ children, className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => {
  return (
    <TableRow 
      className={cn(
        'border-b border-slate-50 transition-colors hover:bg-slate-50/50',
        className
      )} 
      {...props}
    >
      {children}
    </TableRow>
  );
};

export const PremiumTableCell = ({ children, className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) => {
  return (
    <TableCell className={cn('px-6 py-5', className)} {...props}>
      {children}
    </TableCell>
  );
};
