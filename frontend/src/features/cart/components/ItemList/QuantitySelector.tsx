import { Button } from '@/components/ui/button'
import { Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QuantitySelectorProps {
  quantity: number
  stockQuantity: number
  onDecrease: () => void
  onIncrease: () => void
  className?: string
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}

export function QuantitySelector({
  quantity,
  stockQuantity,
  onDecrease,
  onIncrease,
  className,
  size = 'md',
  disabled = false,
}: QuantitySelectorProps) {
  const sizes = {
    sm: {
      container: 'h-8 px-1 gap-1',
      button: 'h-6 w-6',
      icon: 'h-3 w-3',
      text: 'text-xs w-6',
    },
    md: {
      container: 'h-10 px-1.5 gap-2',
      button: 'h-8 w-8',
      icon: 'h-3.5 w-3.5',
      text: 'text-sm w-8',
    },
    lg: {
      container: 'h-14 px-2 gap-4',
      button: 'h-10 w-10',
      icon: 'h-4 w-4',
      text: 'text-lg w-10',
    },
  }

  const currentSize = sizes[size]

  return (
    <div
      className={cn(
        'quantity-selector-premium',
        currentSize.container,
        className,
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className={cn('quantity-selector-btn', currentSize.button)}
        disabled={disabled || quantity <= 1}
        onClick={(e) => {
          e.stopPropagation()
          onDecrease()
        }}
      >
        <Minus className={currentSize.icon} strokeWidth={3} />
      </Button>

      <span
        className={cn(
          'text-center font-mono font-black text-slate-900 dark:text-white',
          currentSize.text,
        )}
      >
        {quantity}
      </span>

      <Button
        variant="ghost"
        size="icon"
        className={cn('quantity-selector-btn', currentSize.button)}
        disabled={disabled || quantity >= stockQuantity}
        onClick={(e) => {
          e.stopPropagation()
          onIncrease()
        }}
      >
        <Plus className={currentSize.icon} strokeWidth={3} />
      </Button>
    </div>
  )
}
