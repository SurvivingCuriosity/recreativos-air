import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface WindowProps {
  titulo?: string;
  children: React.ReactNode;
  onClose?: () => void;
}

/** Ventana modal genérica sobre el Dialog de shadcn (ver WindowProvider). */
export const Window = ({ titulo = "", children, onClose }: WindowProps) => {
  return (
    <Dialog open onOpenChange={(open) => !open && onClose?.()}>
      <DialogContent className="top-24 translate-y-0 sm:max-w-md">
        <DialogHeader className="text-left">
          <DialogTitle className="pr-10">{titulo}</DialogTitle>
          <DialogDescription className="sr-only">{titulo}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};
