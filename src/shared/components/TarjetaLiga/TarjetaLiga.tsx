import { fondoFutbolinMap } from "../../db/fondoFutbolinMap";
import { logoFutbolinMap } from "../../db/logoFutbolinMap";
import { EstadoLiga } from "../../enum/EstadoLiga";
import type { Liga } from "../../interfaces/Liga";

export interface TarjetaLigaProps {
  liga: Liga;
  onClick?: () => void;
}

export const TarjetaLiga = ({ liga, onClick }: TarjetaLigaProps) => {
  return (
    <div
      onClick={onClick}
      className="hover:border-primary shrink-0 min-h-32 md:h-42 border overflow-hidden md:p-4 p-2 relative bg-neutral-900 rounded-lg border-neutral-800 z-0"
    >
      <div className="relative z-2">
        <div className="flex items-center gap-2">
          <img
            src={logoFutbolinMap[liga.tipoFutbolin]}
            alt={liga.nombre}
            className="size-10"
          />
          <p className="text-xl md:text-3xl font-bold text-primary font-cool">
            {liga.nombre}
          </p>
        </div>
        {liga.estadoLiga === EstadoLiga.EnCurso && (
          <div className="relative z-3 min-w-20 w-min text-orange-500 text-xs p-1 rounded-md">
            En curso
          </div>
        )}
        {liga.estadoLiga === EstadoLiga.SinEmpezar && (
          <div className="relative z-3 min-w-20 w-min text-green-400 text-xs p-1 rounded-md">
            Sin empezar
          </div>
        )}
        <p className="text-neutral-400 bg-neutral-950/50 rounded-lg p-1 text-sm md:text-base max-w-10/12">
          {liga.descripcion}
        </p>
      </div>

      <img
        src={fondoFutbolinMap[liga.tipoFutbolin]}
        alt={liga.nombre}
        className="h-full object-cover z-0 object-right absolute right-0 top-0"
      />
    </div>
  );
};
