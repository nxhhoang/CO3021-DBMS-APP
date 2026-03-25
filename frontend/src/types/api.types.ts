export interface ApiResponse<T> {
  message: string;
  data: T | null;
}

export interface MessageResponse {
  message: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination: {
    totalItems: number; // Total number of items across all pages
    itemCount: number; // Number of items in the current page
    itemsPerPage: number; // Number of items per page, == limit
    totalPages: number;
    currentPage: number;
    nextPage: number | null;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}
