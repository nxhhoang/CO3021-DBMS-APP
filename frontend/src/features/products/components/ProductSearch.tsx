'use client';

import { Input } from '@/components/ui/input';
import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { useProductsQuery } from '../hooks/useProductsQuery';
import { Button } from '@/components/ui/button';

export function ProductSearch() {
  const { params, handleSearch: baseHandleSearch } = useProductsQuery();
  const [keyword, setKeyword] = useState<string>(params.keyword || '');

  useEffect(() => {
    setKeyword(params.keyword || '');
  }, [params.keyword]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    baseHandleSearch(keyword);
  };

  return (
    <form
      onSubmit={handleSearch}
      className={`relative mx-auto w-full max-w-2xl`}
    >
      <Input
        type="text"
        value={keyword}
        placeholder="Search products..."
        onChange={(e) => setKeyword(e.target.value)}
        className="focus:border-primary focus:ring-primary w-full rounded-full border border-gray-300 bg-white px-4 py-2 focus:ring-2 focus:ring-offset-2"
      />
      <Button
        type="submit"
        size="icon-sm"
        variant="ghost"
        className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full"
      >
        <Search className="text-muted-foreground" />
      </Button>
    </form>
  );
}
