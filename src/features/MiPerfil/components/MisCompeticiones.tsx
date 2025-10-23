import { faTrophy } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import { Button } from "../../../packages/components/Button/Button";
import { useAuth } from "../../../shared/api/auth/useAuth";
import { useLigas } from "../../../shared/api/ligas/useLigas";
import { TarjetaLiga } from "../../../shared/components/TarjetaLiga/TarjetaLiga";

export const MisCompeticiones = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    data: ligas,
    isLoading: loadingLigas,
    error: errorLigas,
  } = useLigas();

  if (loadingLigas)
    return (
      <p className="text-center p-8 text-neutral-500">Cargando ligas...</p>
    );

  if (errorLigas)
    return (
      <p className="text-center p-8 text-red-500">
        Ups... {String(errorLigas || "Algo pasó")}
      </p>
    );

  const ligasEnLasQueEstaInscrito = ligas?.filter((l) =>
    l.equipos.some((e) =>
      e.equipo.jugadores.some((j) => j.idUsuario === user?.id)
    )
  );

  if (ligasEnLasQueEstaInscrito === undefined)
    return (
      <p className="text-center p-8 text-red-500">
        Ups... error ligas=undefined
      </p>
    );

  if (ligasEnLasQueEstaInscrito.length === 0)
    return (
      <div className="text-neutral-300 p-4 text-center bg-neutral-800/90 rounded-lg">
        <p className="p-3">No inscrito a ninguna competición</p>
        <Button
          onClick={() => navigate("/competiciones")}
          variant="outline"
          icon={faTrophy}
        >
          Ver competiciones
        </Button>
      </div>
    );

  return (
    <ul className="pb-3 flex overflow-x-auto gap-4 mt-2 snap-x rounded-lg ">
      {ligasEnLasQueEstaInscrito.map((l) => (
        <div
          key={l.id}
          className="w-[87%] max-w-96 shrink-0 snap-center rounded-xl"
        >
          <TarjetaLiga
            key={l.id}
            liga={l}
            onClick={() => navigate(`/competiciones/${l.id}/clasificacion`)}
          />
        </div>
      ))}
    </ul>
  );
};
