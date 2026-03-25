'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination';
import { GetProductsRequest, ProductResponse } from '@/types/product.types';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const params: GetProductsRequest = {
    keyword: searchParams.get('keyword') || '',
    category: searchParams.get('category') || undefined,
    page: Number(searchParams.get('page')) || 1,
    limit: Number(searchParams.get('limit')) || 10,
    priceMin: searchParams.get('priceMin')
      ? Number(searchParams.get('priceMin'))
      : undefined,
    priceMax: searchParams.get('priceMax')
      ? Number(searchParams.get('priceMax'))
      : undefined,
    sort: searchParams.get('sort') as any,
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await productService.getProducts(params);

      setProducts(data.data ?? []);
      setMessage(data.message);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-xl font-bold">
        {params.keyword?.length == 0
          ? ''
          : `${message} liên quan đến "${params.keyword}"`}
      </h1>

      <div className="flex flex-col gap-8 md:flex-row">
        {/* Sidebar lọc (Bạn có thể map các attributes ở đây) */}
        <aside className="bg-primary/20 w-full space-y-6 md:w-64">
          {/* Thêm các component Filter tại đây và gọi handleFilterChange */}
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
        </main>
      </div>
    </div>
  );
}
