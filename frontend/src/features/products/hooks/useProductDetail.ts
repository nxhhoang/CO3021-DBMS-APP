'use client';

import { useState, useEffect, useCallback } from 'react';
import { productService } from '../services/products.service';
import { ProductDetail } from '@/types';

export const useProductDetail = (id: string) => {
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      const response = await productService.getProductDetail(id);
      setProduct(response.data ?? null);
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Failed to fetch product details.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    fetchProduct();
  }, [fetchProduct]);

  return { product, loading, error, refresh: fetchProduct };
};
