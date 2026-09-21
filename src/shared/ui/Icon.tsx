import type { LucideIcon, LucideProps } from "lucide-react";

export type { LucideIcon };

/**
 * Renderiza un icono de lucide-react recibido como prop.
 * Por defecto mide `1em`, de modo que se dimensiona con la clase `text-*`
 * del contenedor (mismo comportamiento que tenían los iconos FontAwesome).
 */
export const Icon = ({
  icon: Comp,
  size = "1em",
  strokeWidth = 2,
  ...props
}: { icon: LucideIcon } & LucideProps) => {
  return <Comp size={size} strokeWidth={strokeWidth} aria-hidden="true" {...props} />;
};
