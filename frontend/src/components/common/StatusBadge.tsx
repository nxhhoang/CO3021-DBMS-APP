'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  className?: string;
  variant?: 'dot' | 'outline' | 'glass';
}

const getStatusConfig = (status: string) => {
  const s = status.toUpperCase();
  switch (s) {
    case 'PENDING':
      return { 
        label: 'Chờ xác nhận', 
        glassClass: 'glass-badge-amber',
        dotClass: 'bg-amber-500' 
      };
    case 'PROCESSING':
      return { 
        label: 'Đang xử lý', 
        glassClass: 'glass-badge-blue',
        dotClass: 'bg-blue-500' 
      };
    case 'SHIPPING':
    case 'SHIPPED':
      return { 
        label: 'Đang giao hàng', 
        glassClass: 'glass-badge-blue',
        dotClass: 'bg-blue-500' 
      };
    case 'DELIVERED':
    case 'COMPLETED':
    case 'SUCCESS':
      return { 
        label: 'Đã hoàn thành', 
        glassClass: 'glass-badge-emerald',
        dotClass: 'bg-emerald-500' 
      };
    case 'CANCELLED':
      return { 
        label: 'Đã hủy', 
        glassClass: 'glass-badge-red',
        dotClass: 'bg-rose-500' 
      };
    case 'FAILED':
      return { 
        label: 'Thất bại', 
        glassClass: 'glass-badge-red',
        dotClass: 'bg-rose-500' 
      };
    default:
      return { 
        label: s, 
        glassClass: 'glass-badge',
        dotClass: 'bg-slate-500' 
      };
  }
};

export const StatusBadge = ({
  status,
  className,
  variant = 'glass',
}: StatusBadgeProps) => {
  const config = getStatusConfig(status);

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 transition-all duration-300',
        variant === 'glass' && config.glassClass,
        variant === 'outline' && 'rounded-full border border-slate-200 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest',
        variant === 'dot' && 'bg-transparent px-0 text-[10px] font-black uppercase tracking-widest',
        className
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full animate-pulse', config.dotClass)} />
      <span className={variant === 'dot' ? 'text-slate-600' : ''}>{config.label}</span>
    </div>
  );
};
