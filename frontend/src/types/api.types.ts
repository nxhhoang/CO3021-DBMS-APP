export interface ApiResponse<T> {
  message: string;
  data: T | null;
}

export interface MessageResponse {
  message: string;
}
