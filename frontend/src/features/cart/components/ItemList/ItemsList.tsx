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
    <div className="space-y-6">
      <div className="sticky top-20 z-10 rounded-full border border-white/40 bg-white/40 px-8 py-5 shadow-xl shadow-slate-200/50 backdrop-blur-3xl dark:border-white/10 dark:bg-slate-900/40">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <label className="flex cursor-pointer items-center gap-4 font-display text-base font-black tracking-tight text-slate-900 dark:text-white">
            <Checkbox
              checked={allSelected}
              onCheckedChange={(checked) => toggleAllSelection(!!checked)}
              aria-label="Chọn tất cả sản phẩm"
              className="h-6 w-6 rounded-lg border-slate-200 transition-all data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
            />
            <span className="uppercase tracking-widest text-[11px] text-slate-400">
              CHỌN TẤT CẢ ({selectedSkus.length}/{items.length})
            </span>
          </label>

          <Button
            variant="ghost"
            size="sm"
            disabled={!hasSelection}
            onClick={() => removeMultipleItems(selectedSkus)}
            className="h-10 rounded-full px-6 font-display text-[10px] font-black tracking-[0.2em] text-rose-500 uppercase transition-all hover:bg-rose-50 active:scale-95 disabled:opacity-20 dark:hover:bg-rose-900/20"
          >
            <Trash2 className="mr-2 h-4 w-4" strokeWidth={2.5} />
            Loại bỏ đã chọn
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
