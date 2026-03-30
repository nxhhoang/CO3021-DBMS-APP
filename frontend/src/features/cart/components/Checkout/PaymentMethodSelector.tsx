// components/cart/PaymentMethodSelector.tsx
import { Wallet, Landmark, Banknote, LucideIcon } from 'lucide-react';
import { PAYMENT_METHOD } from '@/constants/enum';
import { PaymentMethod } from '@/types';

interface PaymentOption {
  value: PaymentMethod;
  label: string;
  icon: LucideIcon;
}

const OPTIONS: PaymentOption[] = [
  { value: PAYMENT_METHOD.E_WALLET, label: 'Ví điện tử', icon: Wallet },
  { value: PAYMENT_METHOD.BANKING, label: 'Chuyển khoản', icon: Landmark },
  { value: PAYMENT_METHOD.COD, label: 'COD', icon: Banknote },
];

interface Props {
  selected: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}

export const PaymentMethodSelector = ({ selected, onChange }: Props) => {
  return (
    <div className="mt-6 flex flex-col gap-3">
      <p className="text-muted-foreground text-center text-xs">
        Chọn phương thức thanh toán
      </p>
      <div className="grid grid-cols-3 gap-3">
        {OPTIONS.map((method) => {
          const isSelected = selected === method.value;
          const Icon = method.icon;
          return (
            <button
              key={method.value}
              onClick={() => onChange(method.value)}
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
  );
};
