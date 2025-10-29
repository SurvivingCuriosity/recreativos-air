// components/ConfirmDialog.tsx
import { type ReactNode, useEffect } from "react";
import { useLayerZ } from "../hooks/useLayerZ";
import { Portal } from "./Portal";

type ConfirmDialogProps = {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  icon?: ReactNode;
};

export const ConfirmDialog = ({
  isOpen,
  onConfirm,
  onCancel,
  title = "¿Estás seguro?",
  description = "Esta acción no se puede deshacer.",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  icon,
}: ConfirmDialogProps) => {
  const z = useLayerZ();

  // bloquear scroll cuando está abierto
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [isOpen]);

  return (
    <Portal>
      <div
        className={`fixed inset-0 flex items-center justify-center transition-opacity duration-300
          ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        style={{ zIndex: z }}
        aria-hidden={!isOpen}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" onClick={onCancel} />
        {/* Dialog */}
        <div
          className={`relative bg-neutral-900 rounded-xl shadow-lg p-6 w-full max-w-sm mx-4 transform transition-transform duration-300
            ${isOpen ? "scale-100" : "scale-95"}`}
          onClick={(e) => e.stopPropagation()}
          role="dialog" aria-modal="true"
        >
          {icon && <div className="mb-4 text-center">{icon}</div>}
          <h2 className="text-lg font-semibold text-center mb-2 text-primary">{title}</h2>
          <p className="text-sm text-neutral-400 text-center mb-4">{description}</p>
          <div className="flex justify-end gap-2">
            <button onClick={onCancel}
              className="px-4 py-2 w-full text-sm rounded border border-neutral-300 hover:bg-neutral-100 text-neutral-400">
              {cancelText}
            </button>
            <button onClick={onConfirm}
              className="px-4 py-2 w-full text-sm rounded bg-red-600 text-white hover:bg-red-700">
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
};
