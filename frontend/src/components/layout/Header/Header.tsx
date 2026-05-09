'use client'

import Logo from '@/components/common/Logo'
import { ProductSearch } from '@/features/products'
import { DropdownProfile } from './DropdownProfile'
import { useAuthContext } from '@/features/auth'
import { Badge } from '@/components/ui/badge'
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
  const { user, isAuthenticated } = useAuthContext()

  // Populate store from storage on mount so the badge is correct on any page.
  useEffect(() => {
    const stored = cartStorage.getItems()
    setCartItems(
      stored.map((s) => ({
        productId: s.productId,
        sku: s.sku,
        quantity: s.quantity,
        productName: '',
        image: '',
        basePrice: 0,
        skuPrice: 0,
      })),
    )
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
    <header className="header-glass">
      <div className="container mx-auto flex h-16 items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <div className="shrink-0">
          <Logo />
        </div>

        {/* Search */}
        <div className="hidden max-w-xl flex-1 px-12 md:block">
          <ProductSearch variant="header" className="w-full" />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 md:gap-4 lg:gap-6">
          <CartButton count={cartCount} animate={isCartBumping} />

          <div
            className="hidden h-6 w-px bg-slate-200/60 md:block"
            aria-hidden="true"
          />

          <DropdownProfile />

          {isAuthenticated && user?.email && (
            <div className="header-email-badge">
              <span className="max-w-[250px] truncate">{user.email}</span>
            </div>
          )}

          <MobileMenu />
        </div>
      </div>
    </header>
  )
}

export default Header
