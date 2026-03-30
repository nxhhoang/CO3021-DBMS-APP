import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ShieldCheck,
  MapPin,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { OrderItemsList } from '../OrderSummary/OrderItemsList';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import formatVND from '@/features/cart/utils/formatVND';
import { useRouter } from 'next/navigation';
import { Address } from '@/types';

interface Props {
  state: { confirm: boolean; success: boolean };
  setState: (val: any) => void;
  isLoading: boolean;
  isAddressLoading: boolean;
  address: Address | null;
  onConfirm: () => void;
  paymentMethod: any;
  setPaymentMethod: (val: any) => void;
  selectedItems: any[];
  totalPrice: number;
  orderID: number | null;
  setOrderID: (id: number | null) => void; // Thêm prop này để reset ID
}

export const CheckoutDialogs = ({
  state,
  setState,
  isLoading,
  isAddressLoading,
  address,
  onConfirm,
  paymentMethod,
  setPaymentMethod,
  selectedItems,
  totalPrice,
  orderID,
  setOrderID,
}: Props) => {
  const router = useRouter();

  // Hàm reset trạng thái để sẵn sàng cho lần thanh toán tiếp theo
  const handleCloseSuccess = () => {
    setState((prev: any) => ({ ...prev, success: false }));
    setOrderID(null);
  };

  return (
    <>
      {/* Dialog Xác nhận */}
      <Dialog
        open={state.confirm}
        onOpenChange={(v) => setState((prev: any) => ({ ...prev, confirm: v }))}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="text-primary h-5 w-5" /> Xác nhận đơn hàng
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-2">
            {/* Địa chỉ thực tế từ API */}
            <div className="bg-muted/30 rounded-lg border p-4 text-sm">
              <div className="mb-2 flex items-center gap-2 font-semibold">
                <MapPin className="text-primary h-4 w-4" /> Địa chỉ nhận hàng
              </div>

              {isAddressLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[150px]" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ) : address ? (
                <div className="animate-in fade-in duration-300">
                  <p className="font-bold">{address.addressName}</p>
                  <p className="text-muted-foreground leading-relaxed">
                    {`${address.addressLine}, ${address.district}, ${address.city}`}
                  </p>
                </div>
              ) : (
                <div className="text-destructive flex items-center gap-2 py-1">
                  <AlertCircle className="h-4 w-4" />
                  <span>Chưa có địa chỉ mặc định</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold">Sản phẩm:</p>
              <div className="max-h-32 overflow-y-auto rounded-md border p-2">
                <OrderItemsList items={selectedItems} />
              </div>
            </div>

            <PaymentMethodSelector
              selected={paymentMethod}
              onChange={setPaymentMethod}
            />

            <div className="flex items-center justify-between border-t border-dashed pt-4">
              <span className="text-muted-foreground text-sm font-bold uppercase">
                Tổng thanh toán
              </span>
              <span className="text-primary text-2xl font-black">
                {formatVND(totalPrice)}
              </span>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="ghost"
              onClick={() => setState({ ...state, confirm: false })}
            >
              Hủy
            </Button>
            <Button
              className="min-w-[140px]"
              disabled={isLoading || !address}
              onClick={onConfirm}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                'Xác nhận đặt hàng'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Thành công */}
      <Dialog
        open={state.success}
        onOpenChange={(v) => {
          if (!v) handleCloseSuccess(); // Reset khi click ra ngoài hoặc bấm X
        }}
      >
        <DialogContent className="max-w-sm text-center">
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <DialogTitle className="text-xl">Đặt hàng thành công!</DialogTitle>
            <p className="text-muted-foreground text-sm">
              Mã đơn hàng:{' '}
              <span className="text-foreground font-bold">#{orderID}</span>
            </p>
          </div>
          <DialogFooter className="gap-2 sm:justify-center">
            <Button
              variant="outline"
              className="flex-1 sm:flex-none"
              onClick={handleCloseSuccess}
            >
              Đóng
            </Button>
            <Button
              className="flex-1 sm:flex-none"
              onClick={() => {
                handleCloseSuccess();
                router.push('/orders');
              }}
            >
              Xem đơn hàng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
