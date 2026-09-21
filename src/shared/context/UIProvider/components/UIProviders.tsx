import { useState } from "react";
import { ConfirmContext } from "../context/UIContexts";
import { ConfirmDialog } from "../../../components/ConfirmDialog";

type ConfirmOptions = {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "destructive" | "default";
};

export const UIProvider = ({ children }: { children: React.ReactNode }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogOptions, setDialogOptions] = useState<ConfirmOptions>({});
  const [resolver, setResolver] = useState<(result: boolean) => void>();

  const confirm = (options: ConfirmOptions = {}): Promise<boolean> => {
    setDialogOptions(options);
    setDialogOpen(true);
    return new Promise((resolve) => setResolver(() => resolve));
  };
  const handleConfirm = () => {
    setDialogOpen(false);
    resolver?.(true);
  };
  const handleCancel = () => {
    setDialogOpen(false);
    resolver?.(false);
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      <ConfirmDialog
        isOpen={dialogOpen}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        {...dialogOptions}
      />
    </ConfirmContext.Provider>
  );
};
