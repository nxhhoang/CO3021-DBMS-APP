'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CartItem } from '@/types/cart.types';
import formatVND from '@/features/cart/utils/formatVND';
import { useState } from 'react';
import { PAYMENT_METHOD } from '@/constants/enum';
import { PaymentMethod } from '@/types';
import { Wallet, Landmark, Banknote } from 'lucide-react';

interface OrderSummaryProps {
  selectedItems: CartItem[];
  totalPrice: number;
}

const PAYMENT_METHOD_OPTIONS = [
  {
    value: PAYMENT_METHOD.E_WALLET,
    label: 'Ví điện tử',
    icon: Wallet,
  },
  {
    value: PAYMENT_METHOD.BANKING,
    label: 'Chuyển khoản',
    icon: Landmark,
  },
  {
    value: PAYMENT_METHOD.COD,
    label: 'COD',
    icon: Banknote,
  },
];

const OrderSummary = ({ selectedItems, totalPrice }: OrderSummaryProps) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PAYMENT_METHOD.COD,
  );

  const hasItems = selectedItems.length > 0;

  return (
    <div className="h-fit lg:sticky lg:top-24">
      <Card className="border-primary/5 overflow-hidden border-2 shadow-md">
        <div className="bg-primary/5 border-b px-6 py-4">
          <h3 className="text-lg font-bold">Hóa đơn</h3>
        </div>

        <CardContent className="p-6">
          <div className="space-y-4">
            {/* DANH SÁCH SẢN PHẨM */}
            <div>
              <p className="mb-2 text-sm font-semibold">Sản phẩm thanh toán:</p>

              {!hasItems ? (
                <p className="text-muted-foreground text-sm">
                  Chưa chọn sản phẩm
                </p>
              ) : (
                <div className="space-y-1">
                  {selectedItems.map((item) => (
                    <div
                      key={item.sku}
                      className="flex justify-between text-sm"
                    >
                      <span>
                        {item.productName} (x{item.quantity})
                      </span>

                      <span>{formatVND(item.unitPrice * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* TỔNG TIỀN */}
            <div className="border-t pt-4">
              <div className="flex items-end justify-between">
                <span className="text-lg font-medium">Tổng cộng</span>

                <p className="text-primary text-2xl leading-none font-bold">
                  {formatVND(totalPrice)}
                </p>
              </div>
            </div>
          </div>

          {/* PAYMENT METHOD */}
          <div className="mt-6 flex flex-col gap-3">
            <p className="text-muted-foreground text-center text-xs">
              Chọn phương thức thanh toán
            </p>

            <div className="grid grid-cols-3 gap-3">
              {PAYMENT_METHOD_OPTIONS.map((method) => {
                const isSelected = paymentMethod === method.value;
                const Icon = method.icon;

                return (
                  <button
                    key={method.value}
                    onClick={() => setPaymentMethod(method.value)}
                    className={`flex flex-col items-center justify-center gap-1 rounded-lg border p-3 text-xs font-medium transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'hover:border-primary/40'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {method.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* CHECKOUT BUTTON */}
          <Button
            size="lg"
            disabled={!hasItems}
            className="text-md shadow-primary/20 mt-8 w-full font-bold shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Tiến hành thanh toán
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderSummary;
