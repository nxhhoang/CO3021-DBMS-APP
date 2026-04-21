import { Search } from 'lucide-react';
import { FormEvent } from 'react';

type SearchBarProps = {
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  className?: string;
};

export function SearchBar({
  value,
  placeholder = 'Tìm kiếm sản phẩm...',
  onChange,
  onSubmit,
  className = '',
}: SearchBarProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (onSubmit) onSubmit(value ?? '');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`group relative mx-auto w-full max-w-2xl ${className}`}
    >
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full rounded-2xl border border-slate-200 bg-slate-100/50 px-6 py-3.5 pl-14 text-sm transition-all duration-300 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:outline-none group-hover:border-slate-300 group-hover:bg-slate-100/80"
      />

      <Search 
        className="absolute top-1/2 left-5 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-500" 
      />
      
      <button 
        type="submit"
        className="absolute top-1/2 right-3 -translate-y-1/2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white opacity-0 transition-all duration-300 group-focus-within:opacity-100 hover:bg-blue-600"
      >
        Tìm
      </button>
    </form>
  );
}
