'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
    <Button variant="ghost" size="icon" asChild className="relative">
      <Link href={href} aria-label="Giỏ hàng">
        <ShoppingCart
          className={`h-5 w-5 transition-transform duration-200 ${animate ? 'scale-110' : 'scale-100'}`}
        />

        {count > 0 && (
          <Badge
            className={`animate-in zoom-in absolute -top-1 -right-1 h-5 min-w-5 justify-center px-1 transition-transform duration-200 ${animate ? 'scale-110' : 'scale-100'}`}
          >
            {count}
          </Badge>
        )}
      </Link>
    </Button>
  )
}
