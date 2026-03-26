'use client';

import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ProductDetail } from '@/types/product.types';
import { Star } from 'lucide-react';

export function ProductInfo({ product }: { product: ProductDetail }) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">{product.name}</h1>

      <p className="text-primary text-xl font-bold">
        {formatPrice(product.basePrice)}
      </p>

      <p className="text-sm text-gray-600">Đã bán {product.totalSold}</p>

      <p className="text-sm text-gray-600">
        {product.avgRating}{' '}
        <Star className="inline h-4 w-4 fill-yellow-400 text-yellow-400" />
      </p>

      {product.description && (
        <p className="text-muted-foreground">{product.description}</p>
      )}

      <Button size="lg" className="mt-4">
        Add to cart
      </Button>
    </div>
  );
}
