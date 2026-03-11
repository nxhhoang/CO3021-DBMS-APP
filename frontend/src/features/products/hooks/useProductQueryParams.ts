import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { GetProductsRequest } from '@/types/product.types';

export default function useProductQueryParams(): GetProductsRequest {
  const searchParams = useSearchParams();

  return useMemo(() => {
    const attrs: Record<string, string> = {};

    searchParams.forEach((value, key) => {
      const match = key.match(/^attrs\[(.*)\]$/);
      if (match) {
        attrs[match[1]] = value;
      }
    });

    return {
      keyword: searchParams.get('keyword') || '',
      category: searchParams.get('category') || undefined,
      page: Number(searchParams.get('page')) || 1,
      limit: Number(searchParams.get('limit')) || 10,

      price_min: searchParams.get('price_min')
        ? Number(searchParams.get('price_min'))
        : undefined,

      price_max: searchParams.get('price_max')
        ? Number(searchParams.get('price_max'))
        : undefined,

      sort: searchParams.get('sort') as any,

      attrs: attrs,
    };
  }, [searchParams]);
}
