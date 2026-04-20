import { CartItem } from '@/types/cart.types';
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Trash2 } from 'lucide-react'
import ItemCard from './ItemCard';

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
    <div className="space-y-4 lg:col-span-2">
      <div className="bg-background/90 supports-backdrop-filter:bg-background/70 sticky top-20 z-10 rounded-lg border px-3 py-2 backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
            <Checkbox
              checked={allSelected}
              onCheckedChange={(checked) => toggleAllSelection(!!checked)}
              aria-label="Chọn tất cả sản phẩm"
            />
            <span>
              Chọn tất cả ({selectedSkus.length}/{items.length})
            </span>
          </label>

          <Button
            variant="ghost"
            size="sm"
            disabled={!hasSelection}
            onClick={() => removeMultipleItems(selectedSkus)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Xóa đã chọn
          </Button>
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

export default ItemsList;
