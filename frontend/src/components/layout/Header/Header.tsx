'use client';

import Logo from '../../common/Logo';
import { SearchBar } from '@/components/common/SearchBar';
import { useEffect, useState } from 'react';
import { DropdownProfile } from './DropdownProfile';
import { CartButton } from './CartButton';
import { useRouter, useSearchParams } from 'next/navigation';

const Header = () => {
  const [query, setQuery] = useState<string>('');
  const router = useRouter();
  const searchParams = useSearchParams(); // Hook để lấy params từ URL

  // Lấy keyword từ URL
  const urlKeyword = searchParams.get('keyword') || '';

  // BẤT CỨ KHI NÀO urlKeyword thay đổi (nhấn Back/Forward/Search mới),
  // cập nhật lại ô input
  useEffect(() => {
    setQuery(urlKeyword);
  }, [urlKeyword]);

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
            const keyword = value.trim();

            if (!keyword) return;
            if (document.activeElement instanceof HTMLElement) {
              document.activeElement.blur();
            }
            const params = new URLSearchParams();
            params.set('keyword', keyword);
            router.push(`/products?${params.toString()}`);
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
