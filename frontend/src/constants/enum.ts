export const ORDER_STATUS = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
} as const;

export const ROLE = {
  CUSTOMER: 'CUSTOMER',
  ADMIN: 'ADMIN',
} as const;

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
