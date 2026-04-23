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
    case 'PROCESSING':
      return { label: s, color: 'text-amber-600 bg-amber-50 border-amber-100', dot: 'bg-amber-500' };
    case 'DELIVERED':
    case 'COMPLETED':
    case 'SUCCESS':
      return { label: s, color: 'text-emerald-600 bg-emerald-50 border-emerald-100', dot: 'bg-emerald-500' };
    case 'CANCELLED':
    case 'FAILED':
      return { label: s, color: 'text-rose-600 bg-rose-50 border-rose-100', dot: 'bg-rose-500' };
    case 'SHIPPING':
      return { label: s, color: 'text-blue-600 bg-blue-50 border-blue-100', dot: 'bg-blue-500' };
    default:
      return { label: s, color: 'text-slate-600 bg-slate-50 border-slate-100', dot: 'bg-slate-500' };
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
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-black tracking-widest uppercase transition-all duration-300',
        variant === 'glass' && cn(config.color, 'border ring-1 ring-white/50 backdrop-blur-sm'),
        variant === 'outline' && 'border bg-transparent',
        variant === 'dot' && 'bg-transparent px-0',
        className
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full animate-pulse', config.dot)} />
      <span className={cn(variant === 'dot' && config.color.split(' ')[0])}>{config.label}</span>
    </div>
  );
};
