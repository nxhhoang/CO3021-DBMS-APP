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
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.sku} className="group flex items-center justify-between gap-4 py-1">
          <div className="flex max-w-[70%] items-center gap-2 overflow-hidden">
             <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-black text-slate-500 dark:bg-slate-800">
               {item.quantity}
             </div>
             <span className="truncate font-display text-sm font-bold text-slate-700 dark:text-slate-300 transition-colors group-hover:text-blue-600">
               {item.productName}
             </span>
          </div>
          <span className="shrink-0 font-mono text-[13px] font-black tracking-tighter text-slate-900 dark:text-white">
            {formatVND((item.skuPrice || item.basePrice) * item.quantity)}
          </span>
        </div>
      ))}
    </div>
  )
};
