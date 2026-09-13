import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { TemporadaDTO } from "recreativos-air-core/temporada";

const formatFecha = (fecha: string | null) =>
  fecha ? new Date(fecha).toLocaleDateString("es-ES") : "—";

export const TarjetaTemporadaAdmin = ({
  temporada,
  onClick,
}: {
  temporada: TemporadaDTO;
  onClick: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className="bg-neutral-900 p-2 px-4 rounded-lg relative cursor-pointer"
    >
      {temporada.actual && (
        <p className="absolute -top-1 -right-1 px-1 text-green-400 bg-green-500/20 text-xs rounded-md">
          Actual
        </p>
      )}
      <p className="font-cool text-xl text-primary">{temporada.nombre}</p>
      <div className="flex items-center gap-2 text-sm text-neutral-500">
        <FontAwesomeIcon icon={faCalendarDays} />
        <p>
          {formatFecha(temporada.fechaInicio)} - {formatFecha(temporada.fechaFin)}
        </p>
      </div>
    </div>
  );
};
