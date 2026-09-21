import { cn } from "@/lib/utils";

/** Contador de resultados pendientes de confirmar (admin). Oculto si es 0. */
export const BadgePendientes = ({
  count,
  className,
}: {
  count: number;
  className?: string;
}) => {
  if (count <= 0) return null;
  return (
    <span
      aria-label={`${count} resultados pendientes de confirmar`}
      className={cn(
        "absolute -top-1 -right-1 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-destructive-solid px-1.5 font-sans text-[11px] leading-none font-extrabold text-white",
        className
      )}
    >
      {count}
    </span>
  );
};
