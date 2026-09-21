import { createContext } from "react";

export type ConfirmContextType = {
  confirm: (options?: {
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    /** «destructive» (por defecto): icono papelera y confirmar en rojo. «default»: confirmar en primary. */
    variant?: "destructive" | "default";
  }) => Promise<boolean>;
};

export const ConfirmContext = createContext<ConfirmContextType | null>(null);
