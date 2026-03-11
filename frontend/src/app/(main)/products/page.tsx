'use client';

import { GetProductsRequest } from '@/types/product.types';
import useProducts from '@/features/products/hooks/useProducts';
import ProductList from '@/features/products/components/ProductList';
import FilterSidebar from '@/features/products/components/FilterSidebar';
import useProductQueryParams from '@/features/products/hooks/useProductQueryParams';
import useProductFilters from '@/features/products/hooks/useProductFilters';
import useCategories from '@/features/products/hooks/useCategories';

export default function ProductsPage() {
  const params: GetProductsRequest = useProductQueryParams();

  const { products, loading, message } = useProducts(params);

  const { priceRange, setPriceRange, sort, setSort } =
    useProductFilters(params);

  const { categories } = useCategories();

  return (
    <div className="container mx-auto min-h-screen px-4 py-6 md:py-10">
      {params.keyword && (
        <div className="mb-8">
          <h1 className="text-2xl font-semibold">
            {message}{' '}
            <span className="text-primary italic">"{params.keyword}"</span>
          </h1>

          <p className="text-muted-foreground mt-1 text-sm">
            Tìm thấy {products.length} sản phẩm phù hợp
          </p>
        </div>
      )}

      <div className="flex flex-col gap-6 md:flex-row lg:gap-10">
        {/* Sidebar */}
        <div className="shrink-0">
          <FilterSidebar
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            sort={sort}
            setSort={setSort}
            categories={categories || []}
          />
        </div>

        {/* Product list */}
        <div className="flex-1">
          <ProductList products={products} loading={loading} />
        </div>
      </div>
    </div>
  );
}