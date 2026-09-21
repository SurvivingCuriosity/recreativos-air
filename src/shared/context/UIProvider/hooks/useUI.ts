import { useContext } from "react";
import { ConfirmContext } from "../context/UIContexts";

export const useConfirmDialog = () => {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirmDialog must be used inside UIProvider");
  return ctx;
};
