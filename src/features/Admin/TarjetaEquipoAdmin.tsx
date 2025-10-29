import { faTrophy, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { EquipoDTO } from "recreativos-air-core/equipos";
import type { LigaDTO } from "recreativos-air-core/liga";

export const TarjetaEquipoAdmin = ({ equipo, ligas }: { equipo: EquipoDTO, ligas: LigaDTO[] }) => {


  return (
    <div className="bg-neutral-900 p-2 px-4 rounded-lg relative">
      
      <p className="text-xs text-neutral-500">{equipo.id}</p>
      <p className="font-cool text-xl text-primary">{equipo.nombre}</p>
      <div className="flex items-start justify-between">

      <div className="w-2/3">
        <p className="underline underline-offset-2 text-neutral-600">Jugadores</p>
        {equipo.jugadores.map((j,i) => (
          <div key={j.idUsuario!+i} className="flex items-center gap-2 text-sm text-neutral-400">
            <FontAwesomeIcon icon={faUser} />
            <p className="truncate">{j.nombre}</p>
            {j.idUsuario === null && <p className="text-neutral-600 text-xs truncate">(No registrado)</p>}
          </div>
        ))}
      </div>
      <div className="w-1/3">
        <p className="underline underline-offset-2 text-neutral-600">Liga</p>
        {ligas && ligas.map((l) => (
          <div key={l.id} className="flex items-center gap-2 text-sm text-neutral-400">
            <FontAwesomeIcon icon={faTrophy} />
            <p>{l.nombre}</p>
          </div>
        ))}
      </div>
        </div>
    </div>
  );
};
