// components/cart/PaymentMethodSelector.tsx
import { Wallet, Landmark, Banknote, LucideIcon } from 'lucide-react'
import { PAYMENT_METHOD } from '@/constants/enum'
import { PaymentMethod } from '@/types'

interface PaymentOption {
  value: PaymentMethod
  label: string
  icon: LucideIcon
}

const OPTIONS: PaymentOption[] = [
  { value: PAYMENT_METHOD.E_WALLET, label: 'Ví điện tử', icon: Wallet },
  { value: PAYMENT_METHOD.BANKING, label: 'Chuyển khoản', icon: Landmark },
  { value: PAYMENT_METHOD.COD, label: 'COD', icon: Banknote },
]

interface Props {
  selected: PaymentMethod
  onChange: (method: PaymentMethod) => void
}

export const PaymentMethodSelector = ({ selected, onChange }: Props) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-1 w-4 rounded-full bg-slate-200" />
        <p className="font-display text-[10px] font-black tracking-widest text-slate-400 uppercase">
          Lựa chọn phương thức
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {OPTIONS.map((method) => {
          const isSelected = selected === method.value
          const Icon = method.icon
          return (
            <button
              key={method.value}
              onClick={() => onChange(method.value)}
              className={`group relative flex flex-col items-center justify-center gap-4 rounded-3xl border-2 p-6 transition-all duration-300 ${
                isSelected
                  ? 'border-slate-900 bg-slate-900 text-white shadow-2xl dark:border-white dark:bg-white dark:text-slate-900'
                  : 'border-slate-100 bg-white hover:border-slate-200 dark:border-white/5 dark:bg-slate-800/40 dark:hover:border-white/20'
              }`}
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-colors ${
                  isSelected
                    ? 'bg-white/10 dark:bg-slate-900/10'
                    : 'bg-slate-50 dark:bg-slate-800'
                }`}
              >
                <Icon
                  className={`h-6 w-6 ${isSelected ? 'text-white dark:text-slate-900' : 'text-slate-400'}`}
                  strokeWidth={2.5}
                />
              </div>
              <span className="font-display text-[11px] font-black tracking-widest uppercase">
                {method.label}
              </span>

              {isSelected && (
                <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-white" />
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
