export interface ApiResponse<T> {
  message: string;
  data: T | null;
}

export interface MessageResponse {
  message: string;
}

export interface PaginationParams {
  totalItems: number
  itemCount: number // Number of items in the current page
  itemsPerPage: number // Number of items per page, == limit
  totalPages: number
  currentPage: number
  nextPage: number | null
  hasPrevPage: boolean
  hasNextPage: boolean
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination: PaginationParams;
}
