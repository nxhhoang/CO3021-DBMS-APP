export function buildProductFilterParams(
  searchParams: URLSearchParams,
  localCategory: string,
  localAttrs: Record<string, string>,
  priceRange: [number, number],
  sort: string,
) {
  const newParams = new URLSearchParams(searchParams.toString());

  // Xóa attrs cũ
  Array.from(newParams.keys()).forEach((key) => {
    if (key.startsWith('attrs[')) {
      newParams.delete(key);
    }
  });

  // Add attrs mới
  Object.entries(localAttrs).forEach(([key, value]) => {
    if (value && value !== 'all') {
      newParams.set(`attrs[${key}]`, value);
    }
  });

  // Category
  if (localCategory && localCategory !== 'all') {
    newParams.set('category', localCategory);
  } else {
    newParams.delete('category');
  }

  // Price
  newParams.set('price_min', priceRange[0].toString());
  newParams.set('price_max', priceRange[1].toString());

  // Sort
  if (sort) newParams.set('sort', sort);
  else newParams.delete('sort');

  newParams.set('page', '1');

  return newParams;
}
