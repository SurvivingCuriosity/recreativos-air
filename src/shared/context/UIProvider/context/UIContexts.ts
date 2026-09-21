import { createContext } from "react";

export type ConfirmContextType = {
  confirm: (options?: {
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
  }) => Promise<boolean>;
};

export const ConfirmContext = createContext<ConfirmContextType | null>(null);
