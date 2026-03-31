import { Button } from '@/components/ui/button';
import { CartItem } from '@/types/cart.types'; // Đảm bảo CartItem đã có sku, skuPrice, stockQuantity
import { Card, CardContent } from '@/components/ui/card';
import { Trash } from 'lucide-react';
import formatVND from '@/features/cart/utils/formatVND';
import QuantitySelector from './QuantitySelector';
import { Checkbox } from '@/components/ui/checkbox';

// Mở rộng CartItem nếu type global chưa có stockQuantity
interface CartItemWithStock extends CartItem {
  stockQuantity: number; 
}

interface ItemCardProps {
  item: CartItemWithStock
  updateQuantity: (sku: string, newQuantity: number) => void
  removeItem: (sku: string) => void
  isSelected: boolean
  onToggle: (checked: boolean) => void // Chuẩn hóa type của onCheckedChange
}

const ItemCard = ({
  item,
  updateQuantity,
  removeItem,
  isSelected,
  onToggle,
}: ItemCardProps) => {
  
  const handleQuantityChange = (delta: number) => {
    const newQty = item.quantity + delta
    if (newQty >= 1 && newQty <= item.stockQuantity) {
      updateQuantity(item.sku, newQty)
    }
  }

  return (
    <div className="flex items-start gap-4">
      <Card className="group hover:border-primary/20 flex-1 transition-all">
        <CardContent className="p-4">
          <div className="flex gap-4">
            {/* Checkbox chọn sản phẩm */}
            <div className="flex items-center">
              <Checkbox
                checked={isSelected}
                onCheckedChange={(checked) => onToggle(!!checked)}
                id={`select-${item.sku}`}
              />
            </div>

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
                {/* Hiển thị SKU nếu cần */}
                <p className="text-muted-foreground text-xs uppercase">
                  SKU: {item.sku}
                </p>
              </div>

              <div className="flex items-end justify-between">
                <div className="space-y-1">
                  {/* Sửa từ unitPrice -> skuPrice cho đúng Type hệ thống */}
                  <p className="text-primary text-lg font-bold">
                    {formatVND(item.skuPrice)}
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
                  onDecrease={() => handleQuantityChange(-1)}
                  onIncrease={() => handleQuantityChange(1)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
};

export default ItemCard