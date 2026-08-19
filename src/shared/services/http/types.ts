export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface HttpRequestConfig<TBody = unknown, TParams = unknown> {
  url: string;
  method?: HttpMethod;
  body?: TBody;
  params?: TParams;
  headers?: HeadersInit;
  /** Nombre del microservicio destino (default: "coreapi") */
  service?: string;
  /** Contexto CQRS (default: "cqrs") */
  context?: string;
}

export interface ApiError {
  code: string;
  message: string;
}

/** Envelope estándar de respuesta del backend */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  errors: ApiError[];
  transactionId: string;
  data: T;
}

export interface PaginationQueryParams {
  pagenumber?: number;
  pagesize?: number;
  orderby?: string;
  isasc?: string;
  filter?: string;
  isactive?: boolean;
}

export type PaginateParams = {
  page: number;
  size: number;
  totalPages: number;
  totalRecords: number;
};

export interface PaginatedData<T> extends PaginateParams {
  data: T[];
}

export interface HttpError {
  status: number;
  message: string;
  data?: {
    errors?: ApiError[];
    transactionId?: string;
  };
}

export interface ApiErrorResponse {
  status: number;
  message: string;
  data: {
    errors: ApiError[];
    transactionId: string;
  };
}
