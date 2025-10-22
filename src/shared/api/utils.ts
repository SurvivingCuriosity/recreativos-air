import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import type { ApiErrorPayload } from "./auth/types";
import toast from "react-hot-toast";
import type { ApiResponse } from "./types";

export function handleApiErrors<T extends FieldValues>(
  error: ApiErrorPayload,
  setError: UseFormSetError<T>
): void {
  if (Array.isArray(error)) {
    error.forEach((e) => {
      // filtramos solo si tiene field + message
      if (typeof e.field === "string" && typeof e.message === "string") {
        setError(e.field as Path<T>, { message: e.message });
      }
    });
  } else if (typeof error === "string") {
    // error simple de texto
    toast.error(error);
  } else if (error && typeof error === "object") {
    const errorMessage = error.response!.data as unknown as ApiResponse<null>
    toast.error(errorMessage.data.message);
  }
}
