import type { FormHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Tarjeta de formulario de autenticación (design/screens/Login.html):
 * fondo card-2, radio 20 px, también en móvil (DESIGN.md §6.12).
 */
export const AuthMain = ({ children, className }: { children: ReactNode; className?: string }) => (
  <main
    className={cn(
      "mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 py-5",
      className
    )}
  >
    {children}
  </main>
);

export const AuthCard = ({
  children,
  className,
  ...props
}: FormHTMLAttributes<HTMLFormElement>) => (
  <form
    className={cn(
      "flex w-full flex-col gap-4 rounded-card-lg border border-border bg-card-2 px-[18px] py-[22px] text-foreground",
      className
    )}
    {...props}
  >
    {children}
  </form>
);

export const AuthTitle = ({ children }: { children: ReactNode }) => (
  <h1 className="text-center font-display text-[26px] font-bold tracking-[0.02em] text-foreground uppercase text-glow-brand">
    {children}
  </h1>
);

export const AuthText = ({ children }: { children: ReactNode }) => (
  <p className="text-center text-sm leading-[1.45] text-foreground-soft [&_strong]:text-foreground">
    {children}
  </p>
);

/** Mensaje de validación bajo un campo (12 px, destructive). */
export const FieldError = ({ children }: { children?: ReactNode }) =>
  children ? (
    <p role="alert" className="text-xs font-semibold text-destructive">
      {children}
    </p>
  ) : null;

/** Enlace secundario de auth: subrayado, ≥44 px de alto, contraste AA. */
export const authLinkClass =
  "inline-flex min-h-11 items-center text-sm text-foreground-soft underline underline-offset-2 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

/** Indicador «Paso n de 2» del reset (DESIGN.md §6.12). */
export const StepIndicator = ({ step, total = 2 }: { step: number; total?: number }) => (
  <div
    aria-label={`Paso ${step} de ${total}`}
    className="flex items-center justify-center gap-2 text-xs font-semibold text-muted-foreground"
  >
    {Array.from({ length: total }, (_, i) => (
      <span
        key={i}
        aria-hidden="true"
        className={cn("h-1 w-9 rounded-full", i < step ? "bg-primary" : "bg-border")}
      />
    ))}
    <span>
      Paso {step} de {total}
    </span>
  </div>
);
