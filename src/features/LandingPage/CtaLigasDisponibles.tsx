import { faTrophy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router";
import type { TemporadaDTO } from "recreativos-air-core/temporada";
import { Button } from "../../packages/components/Button/Button";

interface CtaLigasDisponiblesProps {
  ligasDisponibles: number;
  tieneLigas: boolean;
  temporadaActual?: TemporadaDTO | null;
}

export const CtaLigasDisponibles = ({
  ligasDisponibles,
  tieneLigas,
  temporadaActual,
}: CtaLigasDisponiblesProps) => {
  const navigate = useNavigate();

  const titulo = tieneLigas
    ? "Tus ligas han terminado"
    : "Aún no estás en ninguna liga";

  const descripcion =
    ligasDisponibles > 0
      ? `Hay ${ligasDisponibles} ${
          ligasDisponibles === 1 ? "liga abierta" : "ligas abiertas"
        } a inscripción${temporadaActual ? ` en ${temporadaActual.nombre}` : ""}.`
      : "Ahora mismo no hay ligas abiertas a inscripción. Estate atento a las próximas competiciones.";

  return (
    <div className="animate-fade-in-top mt-3 p-4 rounded-3xl border border-primary/30 bg-neutral-900/80 backdrop-blur-xs flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <FontAwesomeIcon icon={faTrophy} className="text-primary" />
        <p className="font-cool text-lg text-primary">{titulo}</p>
      </div>
      <p className="text-sm text-neutral-400">{descripcion}</p>
      <Button
        onClick={() => navigate("/competiciones")}
        variant={ligasDisponibles > 0 ? "primary" : "outline"}
      >
        {ligasDisponibles > 0 ? "Ver ligas disponibles" : "Ver competiciones"}
      </Button>
    </div>
  );
};
