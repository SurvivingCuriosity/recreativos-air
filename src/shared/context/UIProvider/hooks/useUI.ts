import { useContext } from "react";
import {
  ConfirmContext,
  SheetContext,
  ModalContext,
} from "../context/UIContexts";

export const useBottomSheet = () => {
  const ctx = useContext(SheetContext);
  if (!ctx) throw new Error("useBottomSheet must be used inside UIProvider");
  return ctx;
};

export const useConfirmDialog = () => {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirmDialog must be used inside UIProvider");
  return ctx;
};

export const useModal = () => {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used inside UIProvider");
  return ctx;
};
