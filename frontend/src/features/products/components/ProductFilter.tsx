'use client';

import { useProducts } from '../hooks/useProducts';
import { useCategories } from '@/features/categories';
import { useMemo, useState, useEffect } from 'react';
import { formatPrice } from '@/lib/utils';

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { AttributesRequest } from '@/types';

export function ProductFilter() {
  const { params, setQuery } = useProducts();
  const { categories } = useCategories();

  const [priceRange, setPriceRange] = useState<[number, number]>([
    params.priceMin ?? 0,
    params.priceMax ?? 10000000,
  ]);

  // sync URL → UI
  useEffect(() => {
    setPriceRange((prev) => {
      const next: [number, number] = [
        params.priceMin ?? 0,
        params.priceMax ?? 10000000,
      ];

      if (prev[0] === next[0] && prev[1] === next[1]) return prev;

      return next;
    });
  }, [params.priceMin, params.priceMax]);

  const selectedCategory = useMemo(
    () => categories?.find((c) => c.slug === params.category),
    [categories, params.category],
  );

  const handleCategoryChange = (slug: string) => {
    setQuery({
      category: slug || undefined,
      keyword: undefined,
      attributes: undefined,
      page: 1,
    });
  };

  const handlePriceCommit = (value: number[]) => {
    setQuery({
      priceMin: value[0],
      priceMax: value[1],
      page: 1,
    });
  };

  // TOGGLE MULTI ATTRIBUTE
  function toggleSingleAttribute(
    prev: AttributesRequest | undefined,
    key: string,
    value: string,
  ): AttributesRequest | undefined {
    const current = prev?.[key];

    const temp: Record<string, string | undefined> = {
      ...(prev || {}),
    };

    if (current === value) {
      delete temp[key];
    } else {
      temp[key] = value;
    }

    const cleaned = Object.fromEntries(
      Object.entries(temp).filter(([, v]) => v !== undefined),
    ) as AttributesRequest;

    return Object.keys(cleaned).length ? cleaned : undefined;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Category (ẩn nếu đang search keyword) */}
      {!params.keyword && (
        <div className="flex flex-col gap-2">
          <Label>Category</Label>

          <Select
            value={params.category || ''}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="All categories" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="__all__">All categories</SelectItem>
              {categories?.map((c) => (
                <SelectItem key={c._id} value={c.slug}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Price */}
      <div className="flex flex-col gap-2">
        <Label>Price range</Label>

        <Slider
          min={0}
          max={10000000}
          step={100000}
          value={priceRange}
          onValueChange={(v) => setPriceRange(v as [number, number])}
          onValueCommit={handlePriceCommit}
        />

        <div className="text-muted-foreground flex justify-between text-sm">
          <span>{formatPrice(priceRange[0])}</span>
          <span>{formatPrice(priceRange[1])}</span>
        </div>
      </div>

      {/* Dynamic Attributes */}
      {selectedCategory?.dynamicAttributes.map((attr) => {
        const selectedValue = params.attributes?.[attr.key];

        return (
          <div key={attr.key} className="flex flex-col gap-2">
            <Label>{attr.label}</Label>

            <div className="flex flex-wrap gap-2">
              {attr.options.map((opt) => {
                const active = selectedValue === opt;

                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() =>
                      setQuery({
                        attributes: toggleSingleAttribute(
                          params.attributes,
                          attr.key,
                          opt,
                        ),
                        page: 1,
                      })
                    }
                    className={`rounded-md border px-3 py-1 text-sm transition ${
                      active
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-100'
                    } `}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
