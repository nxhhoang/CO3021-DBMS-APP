'use client';

import Logo from '../../common/Logo';
import { SearchBar } from '@/components/common/SearchBar';
import { useEffect, useState } from 'react';
import { DropdownProfile } from './DropdownProfile';
import { useCartStore } from '@/store/cartStore'
import { CartItem } from '@/types'
import { CartButton } from './CartButton';
import { useRouter, useSearchParams } from 'next/navigation';

const Header = () => {
  const [query, setQuery] = useState('');
  const [isCartBumping, setIsCartBumping] = useState(false)

  const router = useRouter();
  const searchParams = useSearchParams()

  const cartItems = useCartStore((state) => state.items)
  const setCartItems = useCartStore((state) => state.setItems)

  const urlKeyword = searchParams.get('keyword') || '';
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  useEffect(() => {
    setQuery(urlKeyword);
  }, [urlKeyword]);

  useEffect(() => {
    const syncCartFromSession = () => {
      try {
        const rawCart = sessionStorage.getItem('cart')
        if (!rawCart) {
          setCartItems([])
          return
        }

        const parsed = JSON.parse(rawCart)
        const items = Array.isArray(parsed)
          ? parsed
          : Array.isArray(parsed?.items)
            ? parsed.items
            : []

        setCartItems(items as CartItem[])
      } catch {
        setCartItems([])
      }
    }

    const handleCartUpdated = () => {
      syncCartFromSession()
      setIsCartBumping(true)
      window.setTimeout(() => setIsCartBumping(false), 300)
    }

    syncCartFromSession()
    window.addEventListener('storage', syncCartFromSession)
    window.addEventListener('cart:updated', handleCartUpdated)

    return () => {
      window.removeEventListener('storage', syncCartFromSession)
      window.removeEventListener('cart:updated', handleCartUpdated)
    }
  }, [setCartItems])

  const handleSearchSubmit = (value: string, blurActiveElement = false) => {
    const keyword = value.trim()
    const params = new URLSearchParams(searchParams.toString())

    if (keyword) {
      params.set('keyword', keyword)
    } else {
      params.delete('keyword')
    }

    if (blurActiveElement && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }

    const queryString = params.toString()
    router.push(queryString ? `/products?${queryString}` : '/products')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/40 bg-white/80 shadow-xs backdrop-blur-xl transition-all duration-300">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:h-20 md:px-10">
        {/* Logo - Căn trái và tạo khoảng trống */}
        <div className="shrink-0 transition-all duration-300 hover:scale-105 active:scale-95">
          <Logo />
        </div>

        {/* Search bar - Được đặt giữa, mở rộng hơn để tạo vẻ hiện đại */}
        <div className="hidden max-w-xl flex-1 px-8 md:block">
          <SearchBar
            value={query}
            onChange={setQuery}
            onSubmit={(value: string) => {
              handleSearchSubmit(value, true)
            }}
            className="w-full"
          />
        </div>

        {/* Actions - Cụm nút bên phải */}
        <div className="flex items-center gap-3 md:gap-6">
          <div className="relative transform transition-all active:scale-95">
            <CartButton count={cartCount} animate={isCartBumping} />
          </div>

          <div
            className="hidden h-6 w-px bg-slate-200 md:block"
            aria-hidden="true"
          />

          <div className="flex items-center gap-2">
            <DropdownProfile />
          </div>
        </div>
      </div>


    </header>
  )
};

export default Header