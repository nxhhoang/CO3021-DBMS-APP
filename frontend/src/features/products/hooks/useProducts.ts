'use client';

import { GetProductsRequest, ProductResponse } from '@/types';
import { useState, useCallback, useMemo, useEffect } from 'react';
import { productService } from '../services/products.service';
import { buildQueryParams, parseQueryParams } from '../utils/queryParams';
import { useProductsQuery } from './useProductsQuery';

export const useProducts = () => {
  const { params, setQuery } = useProductsQuery();

  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState<{
    // For UI render only, not for API request
    page: number;
    limit: number;
    total: number;
  }>({
    page: 1,
    limit: 10,
    total: 0,
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await productService.getProducts(params);

      setProducts(res.data ?? []);

      setPagination((prev) => ({
        page: res?.pagination.currentPage || prev.page,
        limit: res?.pagination.itemsPerPage || prev.limit,
        total: res?.pagination.totalItems || prev.total,
      }));
    } catch (error) {
      console.error('Failed to fetch products:', error);
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
    setPagination,
    setQuery,
  };
};
