'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { buildProductFilterParams } from '../utils/buildProductFilterParams';

export function useProductFilterNavigation() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const applyFilters = (
    category: string,
    attrs: Record<string, string>,
    priceRange: [number, number],
    sort: string,
  ) => {
    const params = buildProductFilterParams(
      searchParams,
      category,
      attrs,
      priceRange,
      sort,
    );

    router.push(`/products?${params.toString()}`);
  };

  return { applyFilters };
}
