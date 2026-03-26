'use client';

import {
  ProductCard,
  ProductFilter,
  ProductSort,
  useProducts,
  ProductPagination,
} from '@/features/products';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemo } from 'react';
import { useCategories } from '@/features/categories';

export default function ProductsPage() {
  const { products, params, loading, pagination } = useProducts();
  const { categories } = useCategories();

  const categoryName = useMemo(() => {
    return categories?.find((c) => c.slug === params.category)?.name;
  }, [categories, params.category]);

  const title = useMemo(() => {
    if (params.keyword) {
      return `Kết quả tìm kiếm cho "${params.keyword}"`;
    }

    if (params.category) {
      return `Danh mục: ${categoryName || params.category}`;
    }

    return 'Tất cả sản phẩm';
  }, [params.keyword, params.category, categoryName]);

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold">{title}</h1>
        <span className="text-muted-foreground text-sm">
          {pagination.totalItems} sản phẩm
        </span>
      </div>

      <div className="flex flex-col gap-8 md:flex-row">
        <aside className="bg-primary/20 w-full space-y-6 md:w-64">
          <ProductSort />
          <ProductFilter />
        </aside>

        {/* Danh sách sản phẩm */}
        <main className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
          <ProductPagination />
        </main>
      </div>
    </div>
  );
}
