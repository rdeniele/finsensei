// This file contains general types and interfaces used throughout the application.

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ErrorResponse {
  success: false;
  message: string;
}

export type Nullable<T> = T | null;