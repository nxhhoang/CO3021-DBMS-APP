'use client';

import { Button } from '@/components/ui/button';
import { useProducts } from '../hooks/useProducts';
import { SORT_BY } from '@/constants/enum';
import { MoveUp, MoveDown } from 'lucide-react';


const SORT_GROUPS = [
  {
    field: 'sold',
    label: 'Sold',
    asc: SORT_BY.SOLD_ASC,
    desc: SORT_BY.SOLD_DESC,
  },
  {
    field: 'basePrice',
    label: 'Price',
    asc: SORT_BY.PRICE_ASC,
    desc: SORT_BY.PRICE_DESC,
  },
  {
    field: 'rating',
    label: 'Rating',
    asc: SORT_BY.RATING_ASC,
    desc: SORT_BY.RATING_DESC,
  },
];

export function ProductSort() {
  const { params, setQuery } = useProducts();

  const handleToggle = (group: typeof SORT_GROUPS[number]) => {
    const current = params.sort;
    let next: (typeof SORT_BY)[keyof typeof SORT_BY] | undefined;

    if (current === group.asc) next = group.desc;   // asc → desc
    else if (current === group.desc) next = undefined; // desc → off
    else next = group.asc;                           // off → asc

    setQuery({ sort: next, page: 1 });
  };

  const getState = (group: typeof SORT_GROUPS[number]) => {
    if (params.sort === group.asc) return 'asc';
    if (params.sort === group.desc) return 'desc';
    return 'inactive';
  };

  return (
    <div className="flex gap-3 flex-wrap">
      {SORT_GROUPS.map((group) => {
        const state = getState(group);

        return (
          <Button
            key={group.field}
            size="sm"
            variant={state === 'inactive' ? 'ghost' : 'outline'}
            onClick={() => handleToggle(group)}
            className="flex items-center gap-1 transition-colors duration-200"
          >
            <span>{group.label}</span>

            {/* Arrow */}
            {state === 'asc' && <MoveUp className="w-4 h-4 transition-opacity duration-200" />}
            {state === 'desc' && <MoveDown className="w-4 h-4 transition-opacity duration-200" />}
          </Button>
        );
      })}
    </div>
  );
}
