import { TipoFutbolin } from "../../enum/TipoFutbolin";
import type { Liga } from "../../interfaces/Liga";
import fondoTsunami from "../../assets/futbolines/tsunami.jpg";
import fondoInfinity from "../../assets/futbolines/infinity.jpg";

export interface TarjetaLigaProps {
  liga: Liga;
}

export const TarjetaLiga = ({ liga }: TarjetaLigaProps) => {
  const imageSrc: Record<TipoFutbolin, string> = {
    [TipoFutbolin.Infinity]: fondoTsunami,
    [TipoFutbolin.Tsunami]: fondoInfinity,
  };

  return (
    <div className="h-32 md:h-42 border overflow-hidden md:p-4 p-2 relative bg-neutral-900 rounded-lg border-neutral-800 z-0">
      <div className="relative z-2">
        <p className="text-xl md:text-3xl font-bold text-primary font-cool">{liga.nombre}</p>
      </div>
      <img
        src={imageSrc[liga.tipoFutbolin]}
        alt={liga.nombre}
        className="h-full w-auto max-w-1/2 object-cover z-0 object-right absolute right-0 top-0"
      />
    </div>
  );
};
