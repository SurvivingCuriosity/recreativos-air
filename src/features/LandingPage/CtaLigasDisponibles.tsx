import { Trophy } from "lucide-react";
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
    <div className="flex animate-fade-in-top flex-col gap-2.5 rounded-liga border border-primary/35 bg-card p-4">
      <div className="flex items-center gap-2">
        <Trophy size={18} className="text-primary-text" aria-hidden="true" />
        <p className="font-display text-lg font-bold text-primary-text">{titulo}</p>
      </div>
      <p className="text-sm text-foreground-soft">{descripcion}</p>
      <Button
        onClick={() => navigate("/competiciones")}
        variant={ligasDisponibles > 0 ? "primary" : "outline"}
      >
        {ligasDisponibles > 0 ? "Ver ligas disponibles" : "Ver competiciones"}
      </Button>
    </div>
  );
};
