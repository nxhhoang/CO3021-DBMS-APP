'use client';

import Logo from '../../common/Logo';
import { SearchBar } from '@/components/common/SearchBar';
import { useEffect, useState } from 'react';
import { DropdownProfile } from './DropdownProfile';
import { CartButton } from './CartButton';
import { useRouter, useSearchParams } from 'next/navigation';

const Header = () => {
  const [query, setQuery] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams()

  const urlKeyword = searchParams.get('keyword') || '';

  useEffect(() => {
    setQuery(urlKeyword);
  }, [urlKeyword]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-20 items-center justify-between px-6 md:px-10">
        {/* Logo - Căn trái và tạo khoảng trống */}
        <div className="flex-shrink-0 transition-transform hover:scale-105">
          <Logo />
        </div>

        {/* Search bar - Được đặt giữa, mở rộng hơn để tạo vẻ hiện đại */}
        <div className="hidden max-w-xl flex-1 px-8 md:block">
          <SearchBar
            value={query}
            onChange={setQuery}
            onSubmit={(value: string) => {
              const keyword = value.trim()
              if (!keyword) return
              if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur()
              }
              const params = new URLSearchParams()
              params.set('keyword', keyword)
              router.push(`/products?${params.toString()}`)
            }}
            // Lưu ý: Đảm bảo SearchBar component của bạn nhận các class này
            // hoặc có style bo tròn (rounded-full) bên trong
            className="w-full"
          />
        </div>

        {/* Actions - Cụm nút bên phải */}
        <div className="flex items-center gap-3 md:gap-6">
          {/* Cart Button với Style tinh tế */}
          <div className="relative transform transition-all active:scale-95">
            <CartButton count={2} />
          </div>

          {/* Divider nhẹ giữa Cart và Profile */}
          <div className="h-6 w-[1px] bg-slate-200" aria-hidden="true" />

          {/* Dropdown Menu Profile */}
          <div className="flex items-center gap-2">
            <DropdownProfile />
            {/* Thêm text ẩn trên mobile để tăng độ sang trọng */}
            {/* <span className="hidden text-xs font-bold tracking-widest text-slate-500 uppercase lg:block">
              Account
            </span> */}
          </div>
        </div>
      </div>

      {/* Search Bar cho Mobile (Hiển thị dưới Header trên màn hình nhỏ) */}
      <div className="border-t border-slate-50 p-4 md:hidden">
        <SearchBar
          value={query}
          onChange={setQuery}
          onSubmit={(value: string) => {
            const keyword = value.trim()
            if (!keyword) return
            const params = new URLSearchParams()
            params.set('keyword', keyword)
            router.push(`/products?${params.toString()}`)
          }}
        />
      </div>
    </header>
  )
};

export default Header