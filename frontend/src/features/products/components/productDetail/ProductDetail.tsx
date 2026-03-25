'use client';

import { useParams } from 'next/navigation';
import { useProductDetail } from '../../hooks/useProductDetail';
import { ProductImageGallery } from './ProductImageGallery';
import { ProductInfo } from './ProductInfo';
import { RelatedProducts } from './RelatedProducts';

export default function ProductDetail() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { product, loading } = useProductDetail(id ?? '');

  if (loading || !product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-10">
      {/* Top section */}
      <div className="grid gap-8 md:grid-cols-2">
        <ProductImageGallery images={product.images} />

        <ProductInfo product={product} />
      </div>

      {/* Related */}
      <RelatedProducts products={relatedProducts} />
    </div>
  );
}
