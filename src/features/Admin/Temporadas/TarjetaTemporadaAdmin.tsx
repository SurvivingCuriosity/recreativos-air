import { CalendarDays } from "lucide-react";
import type { TemporadaDTO } from "recreativos-air-core/temporada";
import { ChipEstado } from "../../../shared/components/ChipEstado/ChipEstado";

const formatFecha = (fecha: string | null) =>
  fecha ? new Date(fecha).toLocaleDateString("es-ES") : "—";

/** TarjetaTemporadaAdmin (design/screens/AdminTemporadas.html). */
export const TarjetaTemporadaAdmin = ({
  temporada,
  onClick,
}: {
  temporada: TemporadaDTO;
  onClick: () => void;
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full flex-col gap-1.5 rounded-card border border-border bg-card px-3.5 py-3 text-left text-foreground transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <span className="flex w-full items-center gap-2">
        <span className="truncate font-display text-[19px] font-bold text-primary-text">
          {temporada.nombre}
        </span>
        {temporada.actual && (
          <ChipEstado color="success" className="ml-auto">
            Actual
          </ChipEstado>
        )}
      </span>
      <span className="inline-flex items-center gap-2 text-sm text-foreground-soft">
        <CalendarDays size={14} className="shrink-0" aria-hidden="true" />
        <span>
          {formatFecha(temporada.fechaInicio)} - {formatFecha(temporada.fechaFin)}
        </span>
      </span>
    </button>
  );
};
