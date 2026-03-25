'use client';

import { Button } from '@/components/ui/button';
import { useProducts } from '../hooks/useProducts';
import { SORT_BY } from '@/constants/enum';
import { ArrowDown, ArrowUp } from 'lucide-react';

const SORT_GROUPS: {
  field: string;
  options: {
    order: 'asc' | 'desc';
    value: (typeof SORT_BY)[keyof typeof SORT_BY];
  }[];
}[] = [
  {
    field: 'sold',
    options: [
      { order: 'asc', value: SORT_BY.SOLD_ASC },
      { order: 'desc', value: SORT_BY.SOLD_DESC },
    ],
  },
  {
    field: 'basePrice',
    options: [
      { order: 'asc', value: SORT_BY.PRICE_ASC },
      { order: 'desc', value: SORT_BY.PRICE_DESC },
    ],
  },
  {
    field: 'rating',
    options: [
      { order: 'asc', value: SORT_BY.RATING_ASC },
      { order: 'desc', value: SORT_BY.RATING_DESC },
    ],
  },
];

const SORT_VALUE_TO_GROUP = new Map<
  string,
  { field: string; order: 'asc' | 'desc' }
>();

SORT_GROUPS.forEach((group) => {
  group.options.forEach((opt) => {
    SORT_VALUE_TO_GROUP.set(opt.value, {
      field: group.field,
      order: opt.order,
    });
  });
});

export function ProductSort() {
  const { params, setQuery } = useProducts();

  function toggleSort(current: string | undefined, value: string) {
    // click again → OFF
    if (current === value) return undefined;

    return value;
  }

  const handleClick = (value: (typeof SORT_BY)[keyof typeof SORT_BY]) => {
    setQuery({
      sort: params.sort === value ? undefined : value,
      page: 1,
    });
  };

  const getActiveValue = (field: string, order: "asc" | "desc") => {
    const group = SORT_GROUPS.find((g) => g.field === field);
    return group?.options.find((o) => o.order === order)?.value;
  };

  return (
    <div className="flex flex-col gap-3">
      {SORT_GROUPS.map((group) => {
        const ascValue = group.options.find((o) => o.order === "asc")?.value;
        const descValue = group.options.find((o) => o.order === "desc")?.value;

        const isAsc = params.sort === ascValue;
        const isDesc = params.sort === descValue;

        return (
          <div key={group.field} className="flex items-center gap-2">
            {/* Label */}
            <span className="w-24 text-sm font-medium capitalize">
              {group.field}
            </span>

            {/* ASC */}
            {ascValue && (
              <Button
                variant={isAsc ? "default" : "outline"}
                size="sm"
                onClick={() => handleClick(ascValue)}
                className="flex items-center gap-1"
              >
                <ArrowUp className="w-4 h-4" />
                Asc
              </Button>
            )}

            {/* DESC */}
            {descValue && (
              <Button
                variant={isDesc ? "default" : "outline"}
                size="sm"
                onClick={() => handleClick(descValue)}
                className="flex items-center gap-1"
              >
                <ArrowDown className="w-4 h-4" />
                Desc
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
}
