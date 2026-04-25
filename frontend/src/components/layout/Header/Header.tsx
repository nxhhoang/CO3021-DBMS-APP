'use client'

import Logo from '@/components/common/Logo'
import { ProductSearch } from '@/features/products'
import { DropdownProfile } from './DropdownProfile'
import { useCartStore } from '@/store/cartStore'
import { CartButton } from './CartButton'
import { MobileMenu } from './MobileMenu'
import { useEffect, useState } from 'react'
import { cartStorage } from '@/services/cartStorage'

const Header = () => {
  const [isCartBumping, setIsCartBumping] = useState(false)

  const cartItems = useCartStore((state) => state.items)
  const setCartItems = useCartStore((state) => state.setItems)

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  // Populate store from storage on mount so the badge is correct on any page.
  useEffect(() => {
    setCartItems(cartStorage.getItems())
  }, [setCartItems])

  // Bump animation on cart updates.
  useEffect(() => {
    const handleCartUpdated = () => {
      setIsCartBumping(true)
      window.setTimeout(() => setIsCartBumping(false), 300)
    }
    window.addEventListener('cart:updated', handleCartUpdated)
    return () => window.removeEventListener('cart:updated', handleCartUpdated)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/40 bg-white/70 shadow-sm backdrop-blur-xl transition-all duration-300">
      <div className="container mx-auto flex h-16 items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <div className="shrink-0 transition-all duration-300 hover:scale-105 active:scale-95">
          <Logo />
        </div>

        {/* Search */}
        <div className="hidden max-w-xl flex-1 px-12 md:block">
          <ProductSearch variant="header" className="w-full" />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 lg:gap-8">
          <div className="relative transform transition-all active:scale-95">
            <CartButton count={cartCount} animate={isCartBumping} />
          </div>

          <div
            className="hidden h-6 w-px bg-slate-200/60 md:block"
            aria-hidden="true"
          />

          <div className="flex items-center gap-2">
            <div className="hidden md:block">
              <DropdownProfile />
            </div>
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
