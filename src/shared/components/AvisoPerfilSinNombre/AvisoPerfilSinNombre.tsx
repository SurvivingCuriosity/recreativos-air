import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useLocation } from "react-router";
import { useAuth } from "../../api/auth/useAuth";

export const AvisoPerfilSinNombre = () => {
  const { user } = useAuth();
  const { pathname } = useLocation();

  if (!user || user.nombre?.trim() || pathname === "/mi-perfil/editar")
    return null;

  return (
    <Link
      to="/mi-perfil/editar"
      className="relative z-3 flex items-center justify-center gap-2 px-3 py-2 text-sm text-amber-300 bg-amber-500/15 border-b border-amber-500/30"
    >
      <FontAwesomeIcon icon={faTriangleExclamation} />
      <span>
        Tu perfil no tiene nombre.{" "}
        <span className="underline font-bold">Ponte un nombre</span> para que
        tus compañeros te reconozcan.
      </span>
    </Link>
  );
};
