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
      setLoading(true)
      setError(null)

      const response = await productService.getProducts(params)

      // Giả sử response trả về là object có cấu trúc { message, data: { products, pagination } }
      const result = response?.data // Đây là object chứa { products, pagination }

      if (result) {
        setProducts(result.products ?? [])
        setPagination(result.pagination ?? null) // Lấy pagination từ trong result (tức là response.data)
      }

      setMessage(response.message ?? '')
    } catch (err) {
      // ... lỗi
    } finally {
      setLoading(false)
    }
  }, [params])

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
