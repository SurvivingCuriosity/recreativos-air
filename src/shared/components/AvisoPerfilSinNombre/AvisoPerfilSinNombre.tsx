import { TriangleAlert } from "lucide-react";
import { Link, useLocation } from "react-router";
import { useAuth } from "../../api/auth/useAuth";

/** Banner ámbar bajo el header (brief §2.4; Alert de aviso según DESIGN.md §8). */
export const AvisoPerfilSinNombre = () => {
  const { user } = useAuth();
  const { pathname } = useLocation();

  if (!user || user.nombre?.trim() || pathname === "/mi-perfil/editar")
    return null;

  return (
    <Link
      to="/mi-perfil/editar"
      role="alert"
      className="relative z-20 flex min-h-11 items-center justify-center gap-2 border-b border-warning/35 bg-warning/13 px-3 py-2 text-sm text-warning hover:bg-warning/20 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring"
    >
      <TriangleAlert size={16} className="shrink-0" aria-hidden="true" />
      <span>
        Tu perfil no tiene nombre.{" "}
        <span className="font-bold underline underline-offset-2">Ponte un nombre</span> para
        que tus compañeros te reconozcan.
      </span>
    </Link>
  );
};
