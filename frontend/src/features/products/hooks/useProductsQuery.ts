'use client';

import { useQueryState } from '@/hooks/useQueryState';
import { GetProductsRequest, AttributesRequest } from '@/types';
import {
  buildQueryParams,
  parseQueryParams,
  normalizeProductParams,
  DEFAULT_QUERY,
} from '../utils/queryParams';
import { useCallback } from 'react';

export function useProductsQuery() {
  const { params, setQuery: baseSetQuery } = useQueryState<GetProductsRequest>({
    parse: parseQueryParams,
    build: buildQueryParams,
    defaultValues: DEFAULT_QUERY,
  });

  // wrap lại setQuery để inject normalize và targetPath mặc định
  const setQuery = useCallback(
    (newParams: Partial<GetProductsRequest>) => {
      const merged = { ...params, ...newParams };
      const normalized = normalizeProductParams(merged);
      baseSetQuery(normalized, { targetPath: '/products' });
    },
    [params, baseSetQuery],
  );

  const handleSearch = useCallback(
    (keyword?: string) => {
      setQuery({
        keyword: keyword || undefined,
        category: undefined,
        attributes: undefined,
        page: 1,
      });
    },
    [setQuery]
  );

  const handleCategoryChange = useCallback(
    (slug: string) => {
      setQuery({
        category: slug === 'all' ? undefined : slug,
        keyword: undefined,
        attributes: undefined,
        page: 1,
      });
    },
    [setQuery]
  );


  return {
    params,
    setQuery,
    handleSearch,
    handleCategoryChange,
  };
}
