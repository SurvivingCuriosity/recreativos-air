import { toast as sonnerToast, type ExternalToast } from "sonner";

/** Duraciones de DESIGN.md §5: éxito 2 s, error 4–5 s. */
export const TOAST_SUCCESS_MS = 2000;
export const TOAST_ERROR_MS = 4500;

type Msg = Parameters<typeof sonnerToast.success>[0];

export const toast = Object.assign(
  (message: Msg, data?: ExternalToast) =>
    sonnerToast(message, { duration: TOAST_SUCCESS_MS, ...data }),
  {
    success: (message: Msg, data?: ExternalToast) =>
      sonnerToast.success(message, { duration: TOAST_SUCCESS_MS, ...data }),
    error: (message: Msg, data?: ExternalToast) =>
      sonnerToast.error(message, { duration: TOAST_ERROR_MS, ...data }),
    info: (message: Msg, data?: ExternalToast) =>
      sonnerToast.info(message, { duration: TOAST_SUCCESS_MS, ...data }),
    warning: (message: Msg, data?: ExternalToast) =>
      sonnerToast.warning(message, { duration: TOAST_ERROR_MS, ...data }),
    loading: sonnerToast.loading,
    dismiss: sonnerToast.dismiss,
    promise: sonnerToast.promise,
  }
);

export default toast;
