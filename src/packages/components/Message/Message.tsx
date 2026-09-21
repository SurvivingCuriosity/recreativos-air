import { CircleAlert, CircleCheck, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

/**
 * Aviso inline (info / success / error) sobre el Alert de shadcn.
 * Chips y avisos semánticos (§3): texto = color, fondo = color al 13 %, borde al 35 %.
 */
export const Message = ({
  children,
  variant,
  className = "",
}: {
  children: React.ReactNode;
  variant: "success" | "error" | "info";
  className?: string;
}) => {
  const iconMap = {
    success: CircleCheck,
    error: CircleAlert,
    info: Info,
  } as const;

  const styleMap = {
    success: "border-success/35 bg-success/13 text-success",
    error: "border-destructive/35 bg-destructive/13 text-destructive",
    info: "border-border bg-card text-muted-foreground",
  } as const;

  const IconComp = iconMap[variant];

  return (
    <Alert
      className={cn(
        "items-center gap-x-2 rounded-input px-3 py-2 text-xs has-[>svg]:gap-x-2 [&>svg]:size-4 [&>svg]:translate-y-0",
        styleMap[variant],
        className
      )}
    >
      <IconComp aria-hidden="true" />
      <AlertDescription className="text-xs text-current">{children}</AlertDescription>
    </Alert>
  );
};
