import type { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/** Estado vacío (DESIGN.md §8): copy centrado en muted-foreground. */
export const EstadoVacio = ({
  children,
  action,
  className,
}: {
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "flex flex-col items-center gap-3 rounded-card border border-border bg-card px-4 py-6 text-center text-sm text-muted-foreground",
      className
    )}
  >
    <p>{children}</p>
    {action}
  </div>
);

/** Estado de error: mismo patrón en destructive. */
export const EstadoError = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <p role="alert" className={cn("p-6 text-center text-sm text-destructive", className)}>
    {children}
  </p>
);

/**
 * Skeletons de listas (DESIGN.md §5/§6.13). El copy «Cargando…» se mantiene
 * para lectores de pantalla.
 */
export const SkeletonLista = ({
  count = 3,
  height = "h-24",
  label = "Cargando...",
  className,
}: {
  count?: number;
  height?: string;
  label?: string;
  className?: string;
}) => (
  <div role="status" aria-label={label} className={cn("flex w-full flex-col gap-2.5", className)}>
    {Array.from({ length: count }, (_, i) => (
      <Skeleton key={i} className={cn("w-full rounded-card bg-muted", height)} />
    ))}
    <span className="sr-only">{label}</span>
  </div>
);

export const SkeletonTarjetaLiga = ({ label = "Cargando..." }: { label?: string }) => (
  <div role="status" aria-label={label} className="w-full">
    <Skeleton className="h-[132px] w-full rounded-liga bg-muted" />
    <span className="sr-only">{label}</span>
  </div>
);
