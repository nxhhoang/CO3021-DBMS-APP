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
      className={`relative mx-auto w-full max-w-2xl ${className}`}
    >
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        className="focus:border-primary focus:ring-primary bg-muted w-full rounded-full border border-gray-300 px-4 py-2 pl-10 focus:ring-2 focus:ring-offset-2"
      />

      <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
    </form>
  );
}
