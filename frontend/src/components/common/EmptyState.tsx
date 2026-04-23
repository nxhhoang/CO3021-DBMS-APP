'use client';

import React from 'react';
import { LucideIcon, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState = ({
  icon: Icon = Package,
  title,
  description,
  action,
  className,
}: EmptyStateProps) => {
  return (
    <div
      className={cn(
        'flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center animate-in fade-in zoom-in duration-500',
        className
      )}
    >
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-100">
        <Icon className="h-10 w-10 text-slate-300" strokeWidth={1.5} />
      </div>
      <h3 className="font-display text-xl font-bold text-slate-900">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-slate-500">{description}</p>
      )}
      {action && (
        <Button
          onClick={action.onClick}
          className="mt-6 rounded-full px-8 font-bold shadow-lg shadow-blue-500/20"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
};
