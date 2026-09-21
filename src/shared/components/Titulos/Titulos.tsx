import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Título de página (DESIGN.md §2): Chakra Petch, mayúsculas, tracking .02em,
 * glow en oscuro / sombra dura en claro.
 */
export const PageTitle = ({
  children,
  className,
  color = "foreground",
  align = "left",
}: {
  children: ReactNode;
  className?: string;
  color?: "foreground" | "primary";
  align?: "left" | "center";
}) => (
  <h1
    className={cn(
      "font-display text-[28px] leading-tight font-bold tracking-[0.02em] uppercase text-glow-brand",
      color === "primary" ? "text-primary-text" : "text-foreground",
      align === "center" && "text-center",
      className
    )}
  >
    {children}
  </h1>
);

/** Título de sección (18 px, mayúsculas, tracking .06em) con icono y hueco a la derecha. */
export const SectionTitle = ({
  children,
  icon: IconComp,
  right,
  className,
  size = "md",
}: {
  children: ReactNode;
  icon?: LucideIcon;
  right?: ReactNode;
  className?: string;
  size?: "md" | "sm";
}) => (
  <div className={cn("flex items-center gap-2", className)}>
    {IconComp && (
      <IconComp size={20} className="shrink-0 text-foreground-soft" aria-hidden="true" />
    )}
    <h2
      className={cn(
        "font-display font-bold tracking-[0.06em] text-foreground uppercase",
        size === "md" ? "text-lg" : "text-base"
      )}
    >
      {children}
    </h2>
    {right !== undefined && <div className="ml-auto">{right}</div>}
  </div>
);

/** Contador en píldora junto a un título de sección. */
export const ContadorSeccion = ({
  value,
  color = "primary",
}: {
  value: number;
  color?: "primary" | "destructive";
}) => (
  <span
    className={cn(
      "inline-flex h-[22px] min-w-[22px] items-center justify-center rounded-full px-1.5 text-xs font-extrabold",
      color === "primary"
        ? "bg-primary text-primary-foreground"
        : "bg-destructive-solid text-white"
    )}
  >
    {value}
  </span>
);
