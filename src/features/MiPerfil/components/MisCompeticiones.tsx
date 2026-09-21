import { Trophy } from "lucide-react";
import { useNavigate } from "react-router";
import { cn } from "@/lib/utils";
import { Button } from "../../../packages/components/Button/Button";
import { useAuth } from "../../../shared/api/auth/useAuth";
import { useLigas } from "../../../shared/api/ligas/useLigas";
import {
  EstadoError,
  EstadoVacio,
  SkeletonTarjetaLiga,
} from "../../../shared/components/Estados/Estados";
import { TarjetaLiga } from "../../../shared/components/TarjetaLiga/TarjetaLiga";

/** Mis competiciones: lista vertical si ≤3, carrusel si hay más (DESIGN.md §6.11). */
export const MisCompeticiones = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    data: ligas,
    isLoading: loadingLigas,
    error: errorLigas,
  } = useLigas();

  if (loadingLigas) return <SkeletonTarjetaLiga label="Cargando ligas..." />;

  if (errorLigas)
    return <EstadoError>Ups... {String(errorLigas || "Algo pasó")}</EstadoError>;

  const ligasEnLasQueEstaInscrito = ligas?.filter((l) =>
    l.equipos.some((e) =>
      e.equipo.jugadores.some((j) => j.idUsuario === user?.id)
    )
  );

  if (ligasEnLasQueEstaInscrito === undefined)
    return <EstadoError>Ups... error ligas=undefined</EstadoError>;

  if (ligasEnLasQueEstaInscrito.length === 0)
    return (
      <EstadoVacio
        action={
          <Button
            onClick={() => navigate("/competiciones")}
            variant="outline"
            icon={Trophy}
            className="w-auto"
          >
            Ver competiciones
          </Button>
        }
      >
        No inscrito a ninguna competición
      </EstadoVacio>
    );

  const carrusel = ligasEnLasQueEstaInscrito.length > 3;

  return (
    <ul
      className={cn(
        "flex w-full gap-2.5",
        carrusel ? "-mr-4 snap-x overflow-x-auto pb-2 lg:mr-0" : "flex-col"
      )}
    >
      {ligasEnLasQueEstaInscrito.map((l) => (
        <li key={l.id} className={cn(carrusel && "w-[88%] max-w-96 shrink-0 snap-center")}>
          <TarjetaLiga liga={l} onClick={() => navigate(`/competiciones/${l.id}/clasificacion`)} />
        </li>
      ))}
    </ul>
  );
};
