import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type ChipColor =
  | "primary"
  | "neon"
  | "success"
  | "info"
  | "warning"
  | "destructive"
  | "neutral";

/** Chips semánticos (DESIGN.md §3): texto = color, fondo = color al 13 %, borde = color al 35 %. */
export const chipColorClass: Record<ChipColor, string> = {
  primary: "text-primary-text bg-primary/13 border-primary/35",
  neon: "text-secondary-neon bg-secondary-neon/13 border-secondary-neon/35",
  success: "text-success bg-success/13 border-success/35",
  info: "text-info bg-info/13 border-info/35",
  warning: "text-warning bg-warning/13 border-warning/35",
  destructive: "text-destructive bg-destructive/13 border-destructive/35",
  neutral: "text-foreground-soft bg-muted border-border",
};

export const ChipEstado = ({
  children,
  color,
  icon: IconComp,
  className,
}: {
  children: React.ReactNode;
  color: ChipColor;
  icon?: LucideIcon;
  className?: string;
}) => (
  <span
    className={cn(
      "inline-flex items-center gap-1.5 rounded-chip border px-2 py-[3px] text-xs font-bold whitespace-nowrap",
      chipColorClass[color],
      className
    )}
  >
    {IconComp && <IconComp size={13} strokeWidth={2} aria-hidden="true" />}
    {children}
  </span>
);
