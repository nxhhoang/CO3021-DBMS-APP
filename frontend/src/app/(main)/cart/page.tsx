import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Trash } from 'lucide-react';

export default function CartPage() {
  const mockCart = [1, 2, 3];

  return (
    <div className="container mx-auto py-12">
      <h1 className="mb-10 text-4xl font-bold">Giỏ hàng của bạn</h1>

      <div className="grid gap-10 lg:grid-cols-3">
        {/* ================= LEFT: CART ITEMS ================= */}
        <div className="space-y-6 lg:col-span-2">
          {mockCart.map((i) => (
            <Card key={i}>
              <CardContent className="flex flex-col gap-6 p-6 md:flex-row md:items-center">
                {/* Product Image */}
                <div className="h-24 w-24 shrink-0 rounded bg-gray-200" />

                {/* Product Info */}
                <div className="flex flex-1 flex-col gap-2">
                  <h2 className="text-lg font-semibold">Sản phẩm {i}</h2>
                  <p className="text-muted-foreground">
                    ${(i * 100).toFixed(2)}
                  </p>
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-4">
                  <Input
                    type="number"
                    min={1}
                    defaultValue={1}
                    className="w-20"
                  />

                  <Button variant="destructive" size="icon">
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ================= RIGHT: SUMMARY ================= */}
        <div className="lg:sticky lg:top-24">
          <Card>
            <CardContent className="space-y-6 p-6">
              <div className="flex justify-between text-lg">
                <span>Tạm tính</span>
                <span>$300.00</span>
              </div>

              <div className="flex justify-between text-lg font-semibold">
                <span>Tổng cộng</span>
                <span>$300.00</span>
              </div>

              <Button size="lg" className="w-full">
                Thanh toán
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
