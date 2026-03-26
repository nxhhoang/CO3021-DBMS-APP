'use client';

import { Product } from '@/types';
import { useState, useCallback, useEffect } from 'react';
import { productService } from '../services/products.service';
import { useProductsQuery } from './useProductsQuery';
import { getErrorMessage } from '@/lib/utils';

export const useProducts = () => {
  const { params, setQuery } = useProductsQuery();
  const [error, setError] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState<{
    // For UI render only, not for API request
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  }>({
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 0,
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await productService.getProducts(params);
      if (res.data) {
        const productsWithCategoryId: Product[] = res.data.map((p) => ({
          ...p,
          categoryId: p.category?._id,
        }));
        setProducts(productsWithCategoryId);
      } else {
        setProducts([]);
      }

      setPagination((prev) => ({
        page: res?.pagination.currentPage || prev.page,
        limit: res?.pagination.itemsPerPage || prev.limit,
        totalItems: res?.pagination.totalItems || prev.totalItems,
        totalPages: res?.pagination.totalPages || prev.totalPages,
      }));
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    pagination,
    params,
    error,
    setPagination,
    setQuery,
  };
};
