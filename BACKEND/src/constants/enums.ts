export enum UserVerifyStatus {
  Unverified, // chưa xác thực email, mặc định = 0
  Verified, // đã xác thực email
  Banned // bị khóa
}

export enum TokenType {
  AccessToken,
  RefreshToken,
  ForgotPasswordToken,
  EmailVerifyToken
}

export enum EncodingStatus {
  Pending, // Đang chờ ở hàng đợi (chưa được encode)
  Processing, // Đang encode
  Success, // Encode thành công
  Failed // Encode thất bại
}

export enum ActionType {
  VIEW_PRODUCT = 'VIEW_PRODUCT',
  SEARCH = 'SEARCH',
  ADD_TO_CART = 'ADD_TO_CART'
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
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export enum PaymentMethod {
  COD = 'COD',
  BANKING = 'BANKING',
  E_WALLET = 'E_WALLET'
}
