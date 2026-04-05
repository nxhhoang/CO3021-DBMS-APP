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
    <div className="flex h-10 items-center overflow-hidden rounded-lg border">
      <Button
        variant="ghost"
        size="icon"
        className="h-full rounded-none"
        disabled={quantity <= 1}
        onClick={onDecrease}
      >
        <Minus className="h-4 w-4" />
      </Button>

      <span className="w-12 text-center text-sm font-bold">{quantity}</span>

      <Button
        variant="ghost"
        size="icon"
        className="h-full rounded-none"
        disabled={quantity >= stockQuantity}
        onClick={onIncrease}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  )
}