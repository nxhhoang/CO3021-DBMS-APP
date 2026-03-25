'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useCallback } from 'react';

type UseQueryStateOptions<T> = {
  parse: (sp: URLSearchParams) => T;
  build: (params: T) => URLSearchParams;
  defaultValues?: Partial<T>;
};

export function useQueryState<T extends Record<string, any>>({
  parse,
  build,
  defaultValues,
}: UseQueryStateOptions<T>) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // parse URL → state
  const params = useMemo(() => {
    const parsed = parse(searchParams);
    return {
      ...defaultValues,
      ...parsed,
    };
  }, [searchParams, parse, defaultValues]);

  // chỉ sanitize generic (flat)
  const sanitize = useCallback((params: T): T => {
    const cleaned: Record<string, any> = {};

    Object.entries(params).forEach(([key, value]) => {
      if (value == null) return;

      if (typeof value === 'string' && value.trim() === '') return;

      if (Array.isArray(value) && value.length === 0) return;

      if (
        typeof value === 'object' &&
        !Array.isArray(value) &&
        Object.keys(value).length === 0
      ) {
        return;
      }

      cleaned[key] = value;
    });

    return cleaned as T;
  }, []);

  const setQuery = useCallback(
    (newParams: Partial<T>) => {
      const merged = {
        ...params,
        ...newParams,
      };

      const cleaned = sanitize(merged as T);
      if (cleaned) {
        const query = build(cleaned);
        router.push(`?${query.toString()}`);
      }
    },
    [params, build, router, sanitize],
  );

  return { params, setQuery };
}
