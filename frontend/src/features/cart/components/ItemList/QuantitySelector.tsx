import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  quantity: number;
  stockQuantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
}

export default function QuantitySelector({
  quantity,
  stockQuantity,
  onDecrease,
  onIncrease,
}: QuantitySelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-full bg-white shadow-sm ring-1 ring-slate-100 transition-all hover:bg-slate-50 hover:shadow-md active:scale-90 dark:bg-slate-800 dark:ring-white/5 dark:hover:bg-slate-700"
        disabled={quantity <= 1}
        onClick={onDecrease}
      >
        <Minus className="h-3.5 w-3.5" strokeWidth={3} />
      </Button>

      <span className="w-10 text-center font-mono text-base font-black text-slate-900 dark:text-white">
        {quantity}
      </span>

      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-full bg-white shadow-sm ring-1 ring-slate-100 transition-all hover:bg-slate-50 hover:shadow-md active:scale-90 dark:bg-slate-800 dark:ring-white/5 dark:hover:bg-slate-700"
        disabled={quantity >= stockQuantity}
        onClick={onIncrease}
      >
        <Plus className="h-3.5 w-3.5" strokeWidth={3} />
      </Button>
    </div>
  )
}