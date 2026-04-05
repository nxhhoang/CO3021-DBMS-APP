import { useState, useEffect, useCallback } from 'react';
import { GetProductsRequest, ProductResponse } from '@/types/product.types';
import { PaginationParams, PaginatedResponse } from '@/types';
import { productService } from '@/services/product.service';

function useProducts(params: GetProductsRequest) {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [pagination, setPagination] = useState<PaginationParams | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await productService.getProducts(params);

      setProducts(response?.data?.products ?? [])
      setPagination(response.pagination ?? null);
      setMessage(response.message ?? '');
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    pagination,
    loading,
    error,
    message,
    refetch: fetchProducts,
  };
}

export default useProducts;
