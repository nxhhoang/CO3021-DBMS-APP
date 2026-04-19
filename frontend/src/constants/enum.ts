export const ORDER_STATUS = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
} as const;

export type OrderStatusKey = keyof typeof ORDER_STATUS
export type OrderStatusStyleKey = OrderStatusKey | 'SHIPPING' | 'COMPLETED'

export interface OrderStatusStyle {
  label: string
  textColor: string
  bgColor: string
  dotColor: string
}

export const ORDER_STATUS_STYLES: Record<
  OrderStatusStyleKey,
  OrderStatusStyle
> = {
  PENDING: {
    label: 'Chờ xử lý',
    textColor: 'text-amber-700',
    bgColor: 'bg-amber-50',
    dotColor: 'bg-amber-400',
  },
  PROCESSING: {
    label: 'Đang xử lý',
    textColor: 'text-blue-700',
    bgColor: 'bg-blue-50',
    dotColor: 'bg-blue-400',
  },
  SHIPPING: {
    label: 'Đang giao',
    textColor: 'text-blue-700',
    bgColor: 'bg-blue-50',
    dotColor: 'bg-blue-400',
  },
  SHIPPED: {
    label: 'Đã gửi hàng',
    textColor: 'text-blue-700',
    bgColor: 'bg-blue-50',
    dotColor: 'bg-blue-400',
  },
  DELIVERED: {
    label: 'Đã giao',
    textColor: 'text-green-700',
    bgColor: 'bg-green-50',
    dotColor: 'bg-green-400',
  },
  COMPLETED: {
    label: 'Hoàn tất',
    textColor: 'text-green-700',
    bgColor: 'bg-green-50',
    dotColor: 'bg-green-400',
  },
  CANCELLED: {
    label: 'Đã hủy',
    textColor: 'text-red-700',
    bgColor: 'bg-red-50',
    dotColor: 'bg-red-400',
  },
}

export const getOrderStatusStyle = (status: string): OrderStatusStyle => {
  const key = status.toUpperCase() as OrderStatusStyleKey

  return (
    ORDER_STATUS_STYLES[key] || {
      label: status,
      textColor: 'text-zinc-700',
      bgColor: 'bg-zinc-50',
      dotColor: 'bg-zinc-400',
    }
  )
}

export const ROLE = {
  CUSTOMER: 'CUSTOMER',
  ADMIN: 'ADMIN',
} as const;

export const SORT_BY = {
  PRICE_ASC: 'priceASC',
  PRICE_DESC: 'priceDESC',
  RATING: 'ratingDESC',
  POPULARITY: 'soldDESC',
} as const

export const PAYMENT_METHOD = {
  E_WALLET: 'E_WALLET',
  BANKING: 'BANKING',
  COD: 'COD',
} as const;

export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
} as const;

export const ACTION_TYPE = {
  ADD_TO_CART: 'ADD_TO_CART',
  VIEW_PRODUCT: 'VIEW_PRODUCT',
  SEARCH: 'SEARCH',
} as const;

export const STATS_PERIOD = {
  DAY: 'day',
  MONTH: 'month',
} as const;

export const DEFAULT_MAX_PRICE = 100000000;