'use client';

import { Search } from 'lucide-react';
import { FormEvent, KeyboardEvent } from 'react';
import { cn } from '@/lib/utils';

type SearchBarProps = {
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  className?: string;
  variant?: 'header' | 'filter' | 'admin';
};

export function SearchBar({
  value,
  placeholder = 'Tìm kiếm...',
  onChange,
  onSubmit,
  className = '',
  variant = 'header',
}: SearchBarProps) {
  
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSubmit) {
      e.preventDefault();
      onSubmit(value || '');
    }
  };

  return (
    <div
      className={cn(
        'group relative w-full transition-all duration-300',
        variant === 'header' && 'max-w-2xl',
        className
      )}
    >
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        onKeyDown={handleKeyDown}
        className={cn(
          'w-full transition-all duration-300 focus:outline-none',
          variant === 'header' && 'h-12 rounded-full border border-slate-200 bg-slate-100/50 px-14 text-sm placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10 group-hover:border-slate-300 group-hover:bg-slate-100/80',
          variant === 'admin' && 'h-12 rounded-xl border border-slate-100 bg-white/80 pl-12 pr-4 shadow-sm focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-slate-900/40',
          variant === 'filter' && 'h-11 rounded-xl border border-slate-200/60 bg-white/60 pl-11 pr-4 text-sm focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10'
        )}
      />

      <Search 
        className={cn(
          'absolute top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-600',
          variant === 'header' && 'left-5 h-5 w-5',
          variant === 'admin' && 'left-4 h-4 w-4',
          variant === 'filter' && 'left-4 h-4 w-4'
        )} 
      />
      
      {variant === 'header' && (
        <button 
          type="button"
          onClick={() => onSubmit?.(value || '')}
          className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-slate-900 px-5 py-2 text-xs font-bold text-white opacity-0 transition-all duration-300 group-focus-within:opacity-100 hover:bg-blue-600 active:scale-95"
        >
          Tìm
        </button>
      )}
    </div>
  );
}
