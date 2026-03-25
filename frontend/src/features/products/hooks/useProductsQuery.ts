'use client';

import { useQueryState } from '@/hooks/useQueryState';
import { GetProductsRequest, AttributesRequest } from '@/types';
import {
  buildQueryParams,
  parseQueryParams,
  normalizeProductParams,
  DEFAULT_QUERY,
} from '../utils/queryParams';

export function useProductsQuery() {
  const { params, setQuery: baseSetQuery } = useQueryState<GetProductsRequest>({
    parse: parseQueryParams,
    build: buildQueryParams,
    defaultValues: DEFAULT_QUERY,
  });

  // wrap lại setQuery để inject normalize
  const setQuery = (newParams: Partial<GetProductsRequest>) => {
    const merged = {
      ...params,
      ...newParams,
    };

    const normalized = normalizeProductParams(merged);

    baseSetQuery(normalized);
  };

  return {
    params,
    setQuery,
  };
}
