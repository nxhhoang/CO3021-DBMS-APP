'use client';

import { Product } from '@/types';
import { ProductCard } from '../ProductCard';

export function RelatedProducts({ products }: { products: Product[] }) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Related Products</h2>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </div>
  );
}
