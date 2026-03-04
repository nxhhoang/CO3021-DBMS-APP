export interface ApiResponse<T> {
  message: string;
  data: T;
}

export interface MessageResponse {
  message: string;
}
