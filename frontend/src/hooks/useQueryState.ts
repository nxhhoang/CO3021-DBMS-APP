'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import path from 'path'
import { useMemo, useCallback } from 'react'

type UseQueryStateOptions<T> = {
  parse: (sp: URLSearchParams) => T
  build: (params: T) => URLSearchParams
  defaultValues?: Partial<T>
}

type SetQueryOptions = {
  targetPath?: string // optional target path for navigation
}

export function useQueryState<T extends Record<string, any>>({
  parse,
  build,
  defaultValues,
}: UseQueryStateOptions<T>) {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  // parse URL → state
  const params = useMemo(() => {
    const parsed = parse(searchParams)
    return { ...defaultValues, ...parsed }
  }, [searchParams, parse, defaultValues])

  // remove empty/undefined values
  const sanitize = useCallback((params: T): T => {
    const cleaned: Record<string, any> = {}
    Object.entries(params).forEach(([key, value]) => {
      if (value == null) return
      if (typeof value === 'string' && value.trim() === '') return
      if (Array.isArray(value) && value.length === 0) return
      if (
        typeof value === 'object' &&
        !Array.isArray(value) &&
        Object.keys(value).length === 0
      )
        return
      cleaned[key] = value
    })
    return cleaned as T
  }, [])

  const setQuery = useCallback(
    (newParams: Partial<T>, options?: SetQueryOptions) => {
      const merged: T = { ...params, ...newParams }
      const cleaned = sanitize(merged)
      const query = build(cleaned)
      const queryString = query.toString()
      const target = options?.targetPath || pathname
      const nextUrl = queryString ? `${target}?${queryString}` : target

      // prevent redundant push
      if (target === pathname && queryString === searchParams.toString()) return

      router.push(nextUrl)
    },
    [params, build, router, sanitize, pathname, searchParams],
  )

  return { params, setQuery }
}
