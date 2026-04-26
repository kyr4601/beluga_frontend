export type ApiErrorCode =
  | "WIN"
  | "LOSE"
  | "DUPLICATE"
  | "BEFORE_START"
  | "ENDED"
  | "INVALID_REQUEST"
  | "NOT_FOUND"
  | "SYSTEM_ERROR";

export interface StandardErrorResponse {
  code: ApiErrorCode | string;
  message: string;
  timestamp: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}
