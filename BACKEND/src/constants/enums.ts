export enum TokenType {
  AccessToken,
  RefreshToken
}

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN'
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export enum PaymentMethod {
  COD = 'COD',
  BANKING = 'BANKING',
  E_WALLET = 'E_WALLET'
}

export enum ActionType {
  VIEW_PRODUCT = 'VIEW_PRODUCT',
  SEARCH = 'SEARCH',
  ADD_TO_CART = 'ADD_TO_CART'
}

