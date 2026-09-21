import { cn } from "@/lib/utils";

/** Iniciales: primera letra de las dos primeras palabras (o dos letras si solo hay una). */
export const inicialesEquipo = (nombre: string) => {
  const palabras = nombre.trim().split(/\s+/).filter(Boolean);
  if (palabras.length === 0) return "?";
  if (palabras.length === 1) return palabras[0].slice(0, 2).toUpperCase();
  return (palabras[0][0] + palabras[1][0]).toUpperCase();
};

/**
 * Escudo de equipo (DESIGN.md §4): cuadrado redondeado con las iniciales sobre
 * el color del equipo. Sin color → primary.
 */
export const EscudoEquipo = ({
  nombre,
  color,
  size = 40,
  className,
}: {
  nombre: string;
  color?: string | null;
  size?: 32 | 40 | 44 | 52;
  className?: string;
}) => {
  const base = color?.trim() || "var(--color-primary)";
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-input border border-white/18 font-display font-bold text-white",
        size === 32 && "size-8 text-xs",
        size === 40 && "size-10 text-[15px]",
        size === 44 && "size-11 text-base",
        size === 52 && "size-13 text-[19px]",
        className
      )}
      style={{
        background: `linear-gradient(160deg, ${base}, rgb(10 10 10 / 0.2)), ${base}`,
      }}
    >
      {inicialesEquipo(nombre)}
    </span>
  );
};
