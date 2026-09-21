import { CircleHelp, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type ConfirmDialogProps = {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  icon?: ReactNode;
  variant?: "destructive" | "default";
};

/**
 * Diálogo de confirmación destructivo (patrón design/screens/ConfirmDialog.html):
 * icono en círculo destructive, título display, botones Cancelar (secondary) y
 * confirmar en rojo sólido.
 */
export const ConfirmDialog = ({
  isOpen,
  onConfirm,
  onCancel,
  title = "¿Estás seguro?",
  description = "Esta acción no se puede deshacer.",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  icon,
  variant = "destructive",
}: ConfirmDialogProps) => {
  const destructivo = variant === "destructive";
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent className="max-w-sm">
        <AlertDialogHeader className="items-center text-center sm:text-center">
          <div
            className={
              destructivo
                ? "flex size-14 items-center justify-center rounded-full border border-destructive/35 bg-destructive/13 text-destructive"
                : "flex size-14 items-center justify-center rounded-full border border-primary/35 bg-primary/13 text-primary-text"
            }
          >
            {icon ??
              (destructivo ? (
                <Trash2 size={24} aria-hidden="true" />
              ) : (
                <CircleHelp size={24} aria-hidden="true" />
              ))}
          </div>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-foreground-soft">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-row gap-2 sm:justify-center">
          <AlertDialogCancel variant="secondary" className="flex-1" onClick={onCancel}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            variant={destructivo ? "destructive" : "default"}
            className="flex-1"
            onClick={onConfirm}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
