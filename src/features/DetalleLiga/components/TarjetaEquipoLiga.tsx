import {
  faUsers
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  type EquipoEnLigaDTO
} from "recreativos-air-core/liga";

type Props = {
  equipoLiga: EquipoEnLigaDTO;
  onClick: () => void;
};

export const TarjetaEquipoLiga = ({ equipoLiga, onClick }: Props) => {

  return (
    <div
      className="bg-neutral-800/80 p-2 px-3 pl-5 rounded-lg relative flex flex-col overflow-hidden"
      onClick={onClick}
    >
      <div className="flex items-center">
        <p className="font-cool text-primary tracking-tight font-extrabold text-lg grow w-full">
          {equipoLiga.equipo.nombre}
        </p>

      </div>
      <div
        style={{
          backgroundColor: equipoLiga.equipo.color || "var(--color-primary)",
        }}
        className="absolute h-full left-0 w-2 top-0"
      ></div>
      <div className="flex items-center gap-2 text-neutral-400 p-1.5">
        <FontAwesomeIcon icon={faUsers} size="sm" />
        <p className="text-sm">
          {equipoLiga.equipo.jugadores.map((j) => j.nombre).join(", ")}
        </p>
      </div>
    </div>
  );
};
