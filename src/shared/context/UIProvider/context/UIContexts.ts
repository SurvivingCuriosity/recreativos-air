import { createContext, type ReactNode } from "react";

export type SheetContextType = {
  openSheet: (content: ReactNode, title?: string) => void;
  closeSheet: () => void;
};

export type ConfirmContextType = {
  confirm: (options?: {
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
  }) => Promise<boolean>;
};

export type ModalSize = "sm" | "md" | "lg" | "xl";

export type ModalOptions = {
  title?: string;
  size?: ModalSize;
  closeOnOverlay?: boolean;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;
};

export type ModalContextType = {
  openModal: <T = unknown>(
    content:
      | ReactNode
      | ((controls: { close: () => void; resolve: (value: T) => void }) => ReactNode),
    options?: ModalOptions
  ) => Promise<T | undefined>;
  closeModal: () => void;
};

export const SheetContext = createContext<SheetContextType | null>(null);
export const ConfirmContext = createContext<ConfirmContextType | null>(null);
export const ModalContext = createContext<ModalContextType | null>(null);
