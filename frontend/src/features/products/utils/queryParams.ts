import { GetProductsRequest, AttributesRequest } from '@/types';
import { SORT_BY } from '@/constants/enum';

export const DEFAULT_QUERY = {
  page: 1,
  limit: 10,
  sort: SORT_BY.SOLD_DESC,
};

const parsers = {
  page: Number,
  limit: Number,
  priceMin: Number,
  priceMax: Number,
};

export function normalizeProductParams(
  params: GetProductsRequest,
): GetProductsRequest {
  const cleaned: GetProductsRequest = { ...params };

  // keyword overrides everything
  if (cleaned.keyword) {
    delete cleaned.category;
    delete cleaned.attributes;
    return cleaned;
  }

  // attributes cleanup
  if (cleaned.attributes) {
    const cleanedAttrs = Object.fromEntries(
      Object.entries(cleaned.attributes).filter(
        ([_, v]) => v != null && v !== '',
      ),
    );

    if (Object.keys(cleanedAttrs).length === 0) {
      delete cleaned.attributes;
    } else {
      cleaned.attributes = cleanedAttrs;
    }
  }

  return cleaned;
}

export function buildQueryParams(params: GetProductsRequest) {
  const queryParams = new URLSearchParams();

  if (params.keyword) {
    queryParams.set('keyword', params.keyword);
  }

  if (params.category) {
    queryParams.set('category', params.category);
  }

  if (params.priceMin != null) {
    queryParams.set('priceMin', String(params.priceMin));
  }

  if (params.priceMax != null) {
    queryParams.set('priceMax', String(params.priceMax));
  }

  if (params.page != null) {
    queryParams.set('page', String(params.page));
  }

  if (params.limit != null) {
    queryParams.set('limit', String(params.limit));
  }

  if (params.sort) {
    queryParams.set('sort', params.sort);
  }

  // attributes ONLY serialize
  if (params.attributes) {
    Object.entries(params.attributes).forEach(([key, values]) => {
      queryParams.set(`attrs[${key}]`, String(values));
    });
  }

  console.log('buildQueryParams', params, queryParams.toString());

  return queryParams;
}

function parseAttributes(searchParams: URLSearchParams) {
  const attributes: AttributesRequest = {};

  searchParams.forEach((value, key) => {
    if (!key.startsWith('attrs[')) return;

    const attrKey = key.slice(6, -1);

    if (!attrKey) return;

    // chỉ lấy 1 value (last wins)
    attributes[attrKey] = value;
  });

  return Object.keys(attributes).length > 0 ? attributes : undefined;
}

export function parseQueryParams(searchParams: URLSearchParams) {
  const params: GetProductsRequest = {};
  const attributes = parseAttributes(searchParams);

  searchParams.forEach((value, key) => {
    if (key.startsWith('attrs[')) return;

    if (key in parsers) {
      params[key as keyof GetProductsRequest] = parsers[
        key as keyof typeof parsers
      ](value) as any;
    } else {
      params[key as keyof GetProductsRequest] = value as any;
    }
  });

  if (attributes) {
    params.attributes = attributes;
  }

  return params;
}
