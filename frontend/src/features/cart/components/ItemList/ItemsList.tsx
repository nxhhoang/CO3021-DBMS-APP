import { CartItem } from '@/types/cart.types';
import ItemCard from './ItemCard';

interface ItemsListProps {
  items: CartItem[];
  selectedSkus: string[];
  toggleItemSelection: (sku: string) => void;
  updateQuantity: (sku: string, delta: number) => void;
  removeItem: (sku: string) => void;
}

const ItemsList = ({
  items,
  selectedSkus,
  toggleItemSelection,
  updateQuantity,
  removeItem,
}: ItemsListProps) => {
  return (
    <div className="space-y-4 lg:col-span-2">
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
  );
};

export default ItemsList;
