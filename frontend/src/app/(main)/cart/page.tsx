'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/features/cart/hooks/useCart';
import Link from 'next/link';
import ItemsList from '@/features/cart/components/ItemList/ItemsList';
import OrderSummary from '@/features/cart/components/OrderSummary/OrderSummary';

export default function CartPage() {
  const {
    items,
    selectedItems,
    selectedSkus,
    toggleItemSelection,
    loading,
    updateQuantity,
    removeItem,
    totalPrice,
  } = useCart();

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <Loader2 className="text-primary h-10 w-10 animate-spin" />
        <p className="text-muted-foreground animate-pulse">
          Đang tải giỏ hàng...
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex items-end gap-3">
        <h1 className="text-3xl font-bold tracking-tight">Giỏ hàng</h1>
        <span className="text-muted-foreground mb-1 text-lg">
          ({totalItems} sản phẩm)
        </span>
      </div>

      {items.length === 0 ? (
        <Card className="flex flex-col items-center justify-center border-dashed py-20">
          <div className="bg-secondary mb-4 flex h-20 w-20 items-center justify-center rounded-full">
            <ShoppingBag className="text-muted-foreground h-10 w-10" />
          </div>
          <p className="text-muted-foreground text-lg">
            Giỏ hàng của bạn đang trống.
          </p>
          <Button asChild className="mt-6">
            <Link href="/products">Tiếp tục mua sắm</Link>
          </Button>
        </Card>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          {/* LEFT: DANH SÁCH SẢN PHẨM */}
          <ItemsList
            items={items}
            selectedSkus={selectedSkus}
            toggleItemSelection={toggleItemSelection}
            updateQuantity={updateQuantity}
            removeItem={removeItem}
          />

          {/* RIGHT: HÓA ĐƠN */}
          <OrderSummary selectedItems={selectedItems} totalPrice={totalPrice} />
        </div>
      )}
    </div>
  );
}
