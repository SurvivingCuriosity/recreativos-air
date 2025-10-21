import type { UserDTO } from "recreativos-air-core/user";

export interface AuthPayload {
  token: string;
  user: UserDTO;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: string | null;
}
