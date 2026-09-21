import type React from "react";
import { cn } from "@/lib/utils";

type TituloVariant = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export const Titulo = ({
  className,
  variant,
  children,
}: {
  className?: string;
  variant: TituloVariant;
  children: React.ReactNode;
}) => {
  const Component = variant;

  const classNameMap: Record<TituloVariant, string> = {
    h1: "font-display text-3xl font-bold uppercase tracking-[0.02em] text-primary-text",
    h2: "font-display text-2xl font-bold uppercase tracking-[0.02em] text-primary-text",
    h3: "font-display text-xl font-semibold text-primary-text",
    h4: "font-display text-lg font-semibold text-primary-text",
    h5: "font-display text-base font-semibold text-primary-text",
    h6: "font-display text-sm font-semibold text-primary-text",
  };

  return (
    <Component className={cn(classNameMap[variant], className)}>{children}</Component>
  );
};
