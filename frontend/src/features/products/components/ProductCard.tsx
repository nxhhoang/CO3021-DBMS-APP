'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Product } from '@/types/product.types';
import { ProductImage } from './ProductImage';
import { Star } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="overflow-hidden rounded-2xl transition-shadow hover:shadow-lg">
      <ProductImage
        src={product.images[0]}
        alt={product.name}
        className="h-48 w-full object-cover"
      />
      <CardHeader className="p-4">
        <h2 className="text-lg font-bold">{product.name}</h2>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-primary text-xl font-bold">
          {formatPrice(product.basePrice)}
        </p>
        <p className="text-sm text-gray-600">
          {product.avgRating}{' '}
          <Star className="inline h-4 w-4 fill-yellow-400 text-yellow-400" />
        </p>
        <p className="text-sm text-gray-500">Đã bán {product.totalSold}</p>
      </CardContent>
    </Card>
  );
}
