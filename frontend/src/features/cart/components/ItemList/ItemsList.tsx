import { CartItem } from '@/types/cart.types'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Trash2 } from 'lucide-react'
import { ItemCard } from './ItemCard'

interface ItemsListProps {
  items: CartItem[]
  selectedSkus: string[]
  toggleItemSelection: (sku: string) => void
  toggleAllSelection: (selected: boolean) => void
  updateQuantity: (sku: string, delta: number) => void
  removeItem: (sku: string) => void
  removeMultipleItems: (skus: string[]) => void
}

const ItemsList = ({
  items,
  selectedSkus,
  toggleItemSelection,
  toggleAllSelection,
  updateQuantity,
  removeItem,
  removeMultipleItems,
}: ItemsListProps) => {
  const allSelected = items.length > 0 && selectedSkus.length === items.length
  const hasSelection = selectedSkus.length > 0

  return (
    <div className="space-y-4">
      <div className="glass-container-full sticky top-20 z-10 !px-5 !py-3">
        <div className="flex items-center justify-between gap-4">
          <label className="flex cursor-pointer items-center gap-3">
            <Checkbox
              checked={allSelected}
              onCheckedChange={(checked) => toggleAllSelection(!!checked)}
              className="checkbox-premium"
            />
            <span className="font-display text-[11px] font-bold tracking-[0.1em] text-slate-500 uppercase">
              TẤT CẢ ({selectedSkus.length}/{items.length})
            </span>
          </label>

          {hasSelection && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeMultipleItems(selectedSkus)}
              className="font-display h-9 rounded-full px-4 text-[10px] font-bold tracking-wider text-rose-500 uppercase hover:bg-rose-50 dark:hover:bg-rose-900/10"
            >
              <Trash2 className="mr-2 h-3.5 w-3.5" />
              Xóa mục chọn
            </Button>
          )}
        </div>
      </div>

      {items.map((item) => (
        <ItemCard
          key={item.sku}
          item={item}
          updateQuantity={updateQuantity}
          removeItem={removeItem}
          isSelected={selectedSkus.includes(item.sku)}
          onToggle={() => toggleItemSelection(item.sku)}
        />
      ))}
    </div>
  )
}

export { ItemsList }
