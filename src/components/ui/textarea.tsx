import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-24 w-full rounded-input border border-border bg-card px-3 py-2 text-[15px] text-foreground transition-[color,box-shadow,border-color] outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:border-primary dark:focus-visible:shadow-glow-focus",
        "aria-invalid:border-destructive aria-invalid:bg-destructive/8",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
