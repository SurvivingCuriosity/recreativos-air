import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy, faMedal, faShieldHalved } from "@fortawesome/free-solid-svg-icons";
import { useClasificacionLiga } from "../../api/ligas/useLigas";

interface PosicionUsuarioChipProps {
  ligaId: string;
  equipoId?: string;
}

export const PosicionUsuarioChip = ({ ligaId, equipoId }: PosicionUsuarioChipProps) => {
  const { data: clasificacion } = useClasificacionLiga(ligaId);

  if (!equipoId || !clasificacion) return null;

  const posicion = clasificacion.find((r) => r.equipoId === equipoId);

  if (!posicion) return null;

  const { pos } = posicion;

  let icon = <FontAwesomeIcon icon={faShieldHalved} className="text-sm" />;
  let colorClass = "text-neutral-500 bg-neutral-800 border-neutral-700";
  let label = `${pos}º Puesto`;

  if (pos === 1) {
    icon = <FontAwesomeIcon icon={faTrophy} className="text-sm" />;
    colorClass = "text-amber-400 bg-amber-400/10 border-amber-400/20";
    label = "1º Puesto";
  } else if (pos === 2) {
    icon = <FontAwesomeIcon icon={faMedal} className="text-sm" />;
    colorClass = "text-slate-400 bg-slate-400/10 border-slate-400/20";
    label = "2º Puesto";
  } else if (pos === 3) {
    icon = <FontAwesomeIcon icon={faMedal} className="text-sm" />;
    colorClass = "text-orange-700 bg-orange-700/10 border-orange-700/20";
    label = "3º Puesto";
  }

  return (
    <div className={`flex items-center gap-2 border px-3 py-1.5 w-fit rounded-full text-xs font-bold ${colorClass}`}>
      {icon}
      <span>{label}</span>
    </div>
  );
};
