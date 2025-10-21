import { faHand, faMoneyBill, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "../../../packages/components/Button/Button";
import { useAuth } from "../../../shared/api/auth/useAuth";
import {
  useAprobarInscripcion,
  useMarcarPagado,
} from "../../../shared/api/ligas/useLigas";
import { EstadoEquipoEnLiga } from "../../../shared/enum/EstadoEquipoEnLiga";
import type { EquipoEnLigaDTO } from "recreativos-air-core/liga";

type Props = {
  idLiga: string;
  equipoLiga: EquipoEnLigaDTO;
  onClick: () => void;
};

export const TarjetaEquipoLiga = ({ idLiga, equipoLiga, onClick }: Props) => {
  const { user } = useAuth();
  const isAdmin = user?.admin;

  const pendiente = equipoLiga.estado === EstadoEquipoEnLiga.Pendiente;
  const pendienteDePago = equipoLiga.pagado === false;

  const { mutate: marcarPagado } = useMarcarPagado();
  const { mutate: aprobarInscripcion } = useAprobarInscripcion();

  const handleAceptarInscripcion = () => {
    aprobarInscripcion({
      aprobar: true,
      ligaId: idLiga,
      equipoId: equipoLiga.equipo.id,
    });
  };

  const handleMarcarPagado = () => {
    marcarPagado({
      equipoId: equipoLiga.equipo.id,
      ligaId: idLiga,
    });
  };

  return (
    <div
      className="bg-neutral-800/80 p-2 px-3 pl-5 rounded-lg relative flex flex-col overflow-hidden"
      onClick={onClick}
    >
      <p className="font-cool text-primary tracking-tight font-extrabold text-lg">
        {equipoLiga.equipo.nombre}
      </p>
      <div style={{ backgroundColor: equipoLiga.equipo.color || 'var(--color-primary)' }} className="absolute h-full left-0 w-2 top-0"></div>
      <div className="flex items-center gap-2 text-neutral-400 p-1.5">
        <FontAwesomeIcon icon={faUsers} size="sm"/>
        <p className="text-sm">{equipoLiga.equipo.jugadores.map((j) => j.nombre).join(", ")}</p>
      </div>
      <div className="flex items-center gap-2">
        {isAdmin && pendienteDePago && (
          <div className="p-1 px-2 rounded bg-red-400/10 flex items-center gap-2 text-red-400 mb-2">
            <FontAwesomeIcon icon={faMoneyBill} />
              <p className="text-xs">Falta por pagar</p>
            </div>
        )}
        {isAdmin && pendiente && (
          <div className="p-1 px-2 rounded bg-red-400/10 flex items-center gap-2 text-red-400 mb-2">
            <FontAwesomeIcon icon={faHand} />
              <p className="text-xs">No aceptado</p>
            </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        {isAdmin && pendienteDePago && (
          <Button variant="outline" onClick={handleMarcarPagado}>
            Marcar pagado
          </Button>
        )}
        {isAdmin && pendiente && (
          <Button onClick={handleAceptarInscripcion}>Aceptar</Button>
        )}
      </div>
    </div>
  );
};
