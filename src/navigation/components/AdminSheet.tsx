import { ChevronRight } from "lucide-react";
import { Link } from "react-router";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ADMIN_LINKS } from "../navContent";

/** Hoja inferior «Administración» (design/screens/AdminSheet.html). */
export const AdminSheet = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        showCloseButton={false}
        className="gap-2.5 rounded-t-liga border-t border-primary bg-card px-4 pt-3 pb-[calc(20px+env(safe-area-inset-bottom,0px))]"
      >
        <span aria-hidden="true" className="h-1 w-11 self-center rounded-full bg-input" />
        <SheetHeader className="p-0 text-left">
          <SheetTitle className="font-display text-[17px] font-bold tracking-[0.06em] text-primary-text uppercase">
            Administración
          </SheetTitle>
          <SheetDescription className="sr-only">
            Accesos de administración: usuarios, equipos y temporadas
          </SheetDescription>
        </SheetHeader>
        {ADMIN_LINKS.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            onClick={() => onOpenChange(false)}
            className="flex min-h-14 items-center gap-3 rounded-button border border-border bg-muted px-3.5 font-display text-base font-semibold text-foreground transition-colors hover:bg-muted/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <item.icon size={20} className="text-primary-text" aria-hidden="true" />
            <span>{item.label}</span>
            <ChevronRight size={18} className="ml-auto text-muted-foreground" aria-hidden="true" />
          </Link>
        ))}
      </SheetContent>
    </Sheet>
  );
};
