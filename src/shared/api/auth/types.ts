import type { UserDTO } from "recreativos-air-core/user";

export interface AuthPayload {
  token: string;
  user: UserDTO;
}
export type ApiErrorPayload =
  | string
  | { field: string; message: string }[]
  | Record<string, unknown>;

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T | null;
  error?: ApiErrorPayload;
}
