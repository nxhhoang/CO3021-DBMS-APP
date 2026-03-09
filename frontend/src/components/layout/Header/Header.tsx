'use client';

import Logo from '../../common/Logo';
import { SearchBar } from '@/components/common/SearchBar';
import { useState } from 'react';
import { DropdownProfile } from './DropdownProfile';
import { CartButton } from './CartButton';
import { GetProductsRequest } from '@/types';
import { useRouter } from 'next/navigation';

const Header = () => {
  const [query, setQuery] = useState('');
  const router = useRouter();

  return (
    <header className="bg-background/95 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Logo />
        {/* Search bar */}
        <SearchBar
          value={query}
          onChange={setQuery}
          onSubmit={(value: string) => {
            const params: GetProductsRequest = {
              keyword: value.trim() || undefined,
            };
            const searchString = new URLSearchParams(
              Object.entries(params).reduce(
                (acc, [key, val]) => {
                  if (val !== undefined) acc[key] = String(val);
                  return acc;
                },
                {} as Record<string, string>,
              ),
            ).toString();
            router.push(`/products?${searchString}`);
          }}
        />
        <div className="flex items-center gap-2">
          {/* Cart Button*/}
          <CartButton count={2} />

          {/* Dropdown Menu Profile */}
          <DropdownProfile />
        </div>
      </div>
    </header>
  );
};

export default Header;
