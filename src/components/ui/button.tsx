import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Slot } from "radix-ui";

/**
 * Variantes según design/DESIGN.md §5:
 *  default             → primary degradado (glow en oscuro, sombra dura en claro)
 *  outline             → borde naranja
 *  secondary           → neutral con borde gris
 *  destructive-outline → borde/texto destructive
 *  destructive         → rojo sólido (confirmar en AlertDialog)
 *  ghost / link        → utilitarias
 * Tamaños: 48 px por defecto, 44 px mínimo en cualquier control, icon circular 44.
 */
const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-button font-display text-[15px] font-bold transition-[color,background-color,border-color,box-shadow,transform] outline-none select-none active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[18px]",
  {
    variants: {
      variant: {
        default:
          "bg-linear-to-b from-primary-hi to-primary text-primary-foreground border-[1.5px] border-hard shadow-hard hover:from-primary-hi hover:to-primary-hi dark:border-0 dark:shadow-glow-primary dark:hover:brightness-110",
        outline:
          "border border-primary bg-card-2/80 text-primary-text hover:bg-primary/10",
        secondary:
          "border border-border bg-card text-foreground-soft hover:bg-muted hover:text-foreground",
        "destructive-outline":
          "border border-destructive bg-card text-destructive hover:bg-destructive/10",
        destructive:
          "bg-destructive-solid text-white hover:bg-destructive-solid/90 focus-visible:outline-destructive-solid",
        ghost:
          "text-foreground-soft hover:bg-muted hover:text-foreground",
        link: "h-auto min-h-11 px-0 font-sans text-sm font-normal text-foreground-soft underline underline-offset-4 hover:text-foreground",
      },
      size: {
        default: "h-12 px-4",
        sm: "h-11 px-3 text-sm",
        lg: "h-12 px-6 text-base",
        icon: "size-11 rounded-full",
        "icon-sm": "size-11 rounded-button",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
