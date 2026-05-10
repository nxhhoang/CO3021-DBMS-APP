'use client'

import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface CartButtonProps {
  count?: number
  href?: string
  animate?: boolean
}

export const CartButton = ({
  count = 0,
  href = '/cart',
  animate = false,
}: CartButtonProps) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      asChild
      className="relative transition-all duration-300 hover:bg-blue-50 hover:text-blue-600 active:scale-90"
    >
      <Link href={href} aria-label="Giỏ hàng">
        <ShoppingCart
          className={`h-5 w-5 transition-transform duration-200 ${animate ? 'scale-110' : 'scale-100'}`}
        />

        {count > 0 && (
          <Badge
            className={`animate-in zoom-in absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center border-2 border-white bg-blue-600 px-1 text-[10px] font-bold text-white transition-transform duration-300 ${animate ? 'scale-110' : 'scale-100'}`}
          >
            {count}
          </Badge>
        )}
      </Link>
    </Button>
  )
}
