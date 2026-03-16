import { Button } from '@/components/ui/button';
import { CartItem } from '@/types/cart.types';
import { Card, CardContent } from '@/components/ui/card';
import { Trash } from 'lucide-react';
import formatVND from '@/features/cart/utils/formatVND';
import QuantitySelector from './QuantitySelector';
import { Checkbox } from '@/components/ui/checkbox';

interface ItemCardProps {
  item: CartItem;
  updateQuantity: (sku: string, delta: number) => void;
  removeItem: (sku: string) => void;
  isSelected: boolean;
  onToggle: () => void;
}

const ItemCard = ({
  item,
  updateQuantity,
  removeItem,
  isSelected,
  onToggle,
}: ItemCardProps) => {
  return (
    <div className="flex items-start gap-4">
      {/* Checkbox chọn sản phẩm */}
      <Checkbox
        checked={isSelected}
        onCheckedChange={onToggle}
        className="mt-6"
      />

      <Card className="group hover:border-primary/20 flex-1 transition-all">
        <CardContent className="p-4">
          <div className="flex gap-4">
            {/* Product Image */}
            <div className="bg-secondary relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.productName}
                  className="h-full w-full object-cover transition-transform group-hover:scale-110"
                />
              ) : (
                <div className="text-muted-foreground flex h-full w-full items-center justify-center text-[10px]">
                  No Image
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <div className="flex justify-between gap-2">
                  <h2 className="line-clamp-1 text-lg font-semibold">
                    {item.productName}
                  </h2>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive h-8 w-8"
                    onClick={() => removeItem(item.sku)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-end justify-between">
                <div className="space-y-1">
                  <p className="text-primary text-lg font-bold">
                    {formatVND(item.unitPrice)}
                  </p>

                  <p
                    className={`text-xs ${
                      item.stockQuantity <= 3
                        ? 'text-destructive font-medium'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {item.stockQuantity <= 3
                      ? `Chỉ còn ${item.stockQuantity} sản phẩm!`
                      : `Kho: ${item.stockQuantity}`}
                  </p>
                </div>

                {/* Quantity Controller */}
                <QuantitySelector
                  quantity={item.quantity}
                  stockQuantity={item.stockQuantity}
                  onDecrease={() => updateQuantity(item.sku, -1)}
                  onIncrease={() => updateQuantity(item.sku, 1)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ItemCard;
