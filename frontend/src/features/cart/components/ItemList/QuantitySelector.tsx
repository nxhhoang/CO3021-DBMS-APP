import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  quantity: number;
  stockQuantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
}

const btnClass = 'h-8 w-8 rounded-none';

export default function QuantitySelector({
  quantity,
  stockQuantity,
  onDecrease,
  onIncrease,
}: QuantitySelectorProps) {
  const disableDecrease = quantity <= 1;
  const disableIncrease = quantity >= stockQuantity;

  return (
    <div className="bg-background flex items-center rounded-lg border shadow-sm">
      <Button
        variant="ghost"
        size="icon"
        className={btnClass}
        disabled={disableDecrease}
        onClick={onDecrease}
      >
        <Minus className="h-3 w-3" />
      </Button>

      <span className="flex w-8 justify-center text-sm font-semibold">
        {quantity}
      </span>

      <Button
        variant="ghost"
        size="icon"
        className={btnClass}
        disabled={disableIncrease}
        onClick={onIncrease}
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  );
}
