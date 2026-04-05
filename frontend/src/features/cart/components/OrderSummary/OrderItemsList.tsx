// components/cart/OrderItemsList.tsx
import { CartItem } from '@/types/cart.types';
import formatVND from '@/features/cart/utils/formatVND';

interface Props {
  items: CartItem[];
}

export const OrderItemsList = ({ items }: Props) => {
  if (items.length === 0) {
    return <p className="text-muted-foreground text-sm">Chưa chọn sản phẩm</p>;
  }

  return (
    <div className="space-y-1">
      {items.map((item) => (
        <div key={item.sku} className="flex justify-between text-sm">
          <span className="max-w-[70%] truncate">
            {item.productName} (x{item.quantity})
          </span>
          <span className="font-medium">
            {formatVND(item.basePrice * item.quantity)}
          </span>
        </div>
      ))}
    </div>
  )
};
