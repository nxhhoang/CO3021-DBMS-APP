import { GetProductsRequest, AttributesRequest } from '@/types';
import { SORT_BY } from '@/constants/enum';

export const DEFAULT_QUERY = {
  page: 1,
  limit: 10,
  sort: undefined,
};

const parsers = {
  page: Number,
  limit: Number,
  priceMin: Number,
  priceMax: Number,
};

/**
 * Chỉ cleanup attributes rỗng, không xóa category hay keyword
 */
export function normalizeProductParams(
  params: GetProductsRequest,
): GetProductsRequest {
  const cleaned: GetProductsRequest = { ...params };

  if (cleaned.attributes) {
    const cleanedAttrs = Object.fromEntries(
      Object.entries(cleaned.attributes).filter(
        ([_, v]) => v != null && v !== '',
      ),
    );
    cleaned.attributes = Object.keys(cleanedAttrs).length
      ? cleanedAttrs
      : undefined;
  }

  // console.log('normalizeProductParams', params, cleaned);
  return cleaned;
}
/**
 * Build URLSearchParams từ object
 * - Bỏ qua undefined/null
 * - attributes undefined sẽ không tạo query param
 */
export function buildQueryParams(params: GetProductsRequest) {
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value == null) return; // skip undefined/null

    if (key === 'attributes') {
      Object.entries(value as AttributesRequest).forEach(([k, v]) => {
        if (v != null) queryParams.set(`attrs[${k}]`, String(v));
      });
    } else {
      queryParams.set(key, String(value));
    }
  });

  // console.log('buildQueryParams', params, queryParams.toString());
  return queryParams;
}

/**
 * Parse attributes từ URLSearchParams
 */
function parseAttributes(searchParams: URLSearchParams): AttributesRequest | undefined {
  const attributes: AttributesRequest = {};

  searchParams.forEach((value, key) => {
    if (!key.startsWith('attrs[')) return;

    const attrKey = key.slice(6, -1);
    if (!attrKey) return;

    attributes[attrKey] = value;
  });

  return Object.keys(attributes).length ? attributes : undefined;
}

/**
 * Parse URLSearchParams thành GetProductsRequest
 * - Tất cả keys parse vào object
 * - URL có thể không có giá trị nào (undefined)
 */
export function parseQueryParams(searchParams: URLSearchParams): GetProductsRequest {
  const params: GetProductsRequest = {};
  const attributes = parseAttributes(searchParams);

  searchParams.forEach((value, key) => {
    if (key.startsWith('attrs[')) return;

    if (key in parsers) {
      params[key as keyof GetProductsRequest] = parsers[key as keyof typeof parsers](value) as any;
    } else {
      params[key as keyof GetProductsRequest] = value as any;
    }
  });

  if (attributes) params.attributes = attributes;

  return params;
}
