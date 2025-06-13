import { use } from "react";
import {
  fondoFutbolinMap,
  fondoFutbolinMapLight,
} from "../../db/fondoFutbolinMap";
import {
  logoFutbolinMap,
  logoFutbolinMapLight,
} from "../../db/logoFutbolinMap";
import { EstadoLiga } from "../../enum/EstadoLiga";
import type { Liga } from "../../interfaces/Liga";
import { ThemeContext } from "../../context/ThemeContext";

export interface TarjetaLigaProps {
  liga: Liga;
  onClick?: () => void;
}

export const TarjetaLiga = ({ liga, onClick }: TarjetaLigaProps) => {
  const { darkMode } = use(ThemeContext);

  return (
    <div
      onClick={onClick}
      className="hover:border-primary shrink-0 min-h-32 md:h-42 border overflow-hidden md:p-4 p-1.5 relative bg-neutral-900 rounded-lg border-neutral-800 z-0"
    >
      <div className="relative z-2">
        <div className="flex items-center gap-2">
          <img
            src={
              darkMode
                ? logoFutbolinMap[liga.tipoFutbolin]
                : logoFutbolinMapLight[liga.tipoFutbolin]
            }
            alt={liga.nombre}
            className="size-9"
          />
          <p className="text-lg lg:text-2xl font-bold text-primary font-cool">
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
        <p className="text-neutral-400 bg-neutral-950/50 rounded-lg p-1 text-xs md:text-base max-w-10/12">
          {liga.descripcion}
        </p>
      </div>

      <img
        src={
          darkMode
            ? fondoFutbolinMap[liga.tipoFutbolin]
            : fondoFutbolinMapLight[liga.tipoFutbolin]
        }
        alt={liga.nombre}
        className={`h-full object-cover z-0 object-right absolute right-0 top-0`}
      />
      <span
        className="absolute inset-0 z-0
               pointer-events-none
               bg-gradient-to-r from-neutral-900 via-neutral-900/60 to-transparent"
      />
    </div>
  );
};
