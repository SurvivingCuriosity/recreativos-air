import { ChevronRight } from "lucide-react";
import { Link } from "react-router";

/** Enlace discreto a las ligas anteriores (se listan en Mi perfil › Competiciones). */
export const EnlaceLigasAnteriores = () => (
  <Link
    to="/mi-perfil"
    className="inline-flex min-h-11 items-center gap-1 self-start text-sm font-semibold text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
  >
    Ver ligas anteriores
    <ChevronRight size={16} aria-hidden="true" />
  </Link>
);
