import * as React from "react";
import { cn } from "@/lib/utils";

/** Input de 48 px, radio 12 px, foco con borde primary + glow (§3/§5). */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-12 w-full min-w-0 rounded-input border border-border bg-card px-3 py-1 text-[15px] text-foreground transition-[color,box-shadow,border-color] outline-none selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:border-primary dark:focus-visible:shadow-glow-focus",
        "aria-invalid:border-destructive aria-invalid:bg-destructive/8",
        className
      )}
      {...props}
    />
  );
}

export { Input };
