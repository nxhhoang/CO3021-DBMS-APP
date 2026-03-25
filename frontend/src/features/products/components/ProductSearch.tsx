'use client';

import { Input } from '@/components/ui/input';
import { useProducts } from '../hooks/useProducts';
import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';

export function ProductSearch() {
  const { params, setQuery } = useProducts();
  const [keyword, setKeyword] = useState<string>(params.keyword || '');

  useEffect(() => {
    setKeyword(params.keyword || '');
  }, [params.keyword]);

  const handleSearch = () => {
    setQuery({
      keyword: keyword || undefined,
      category: undefined, // rule: keyword thì bỏ category
      attributes: undefined,
      page: 1,
    });
  };

  return (
    <form
      onSubmit={handleSearch}
      className={`relative mx-auto w-full max-w-2xl`}
    >
      <Input
        type="submit"
        value={keyword}
        placeholder="Search products..."
        onChange={(e) => setKeyword(e.target.value)}
        className="focus:border-primary focus:ring-primary w-full rounded-full border border-gray-300 bg-white px-4 py-2 pl-10 focus:ring-2 focus:ring-offset-2"
      />

      <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
    </form>
  );
}
