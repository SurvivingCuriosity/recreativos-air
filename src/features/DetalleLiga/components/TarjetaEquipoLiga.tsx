import {
  faHand,
  faMoneyBill,
  faTrash,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  EstadoEquipoEnLiga,
  type EquipoEnLigaDTO,
} from "recreativos-air-core/liga";
import { Button } from "../../../packages/components/Button/Button";
import { useAuth } from "../../../shared/api/auth/useAuth";
import {
  useAprobarInscripcion,
  useEliminarEquipoDeLiga,
  useMarcarPagado,
} from "../../../shared/api/ligas/useLigas";
import { useConfirmDialog } from "../../../shared/context/UIProvider/hooks/useUI";

type Props = {
  idLiga: string;
  equipoLiga: EquipoEnLigaDTO;
  onClick: () => void;
};

export const TarjetaEquipoLiga = ({ idLiga, equipoLiga, onClick }: Props) => {
  const { user } = useAuth();
  const isAdmin = user?.admin;

  const { confirm } = useConfirmDialog();

  const pendiente = equipoLiga.estado === EstadoEquipoEnLiga.Pendiente;
  const pendienteDePago = equipoLiga.pagado === false;

  const { mutate: marcarPagado } = useMarcarPagado();
  const { mutate: aprobarInscripcion } = useAprobarInscripcion();
  const { mutate: eliminarEquipo } = useEliminarEquipoDeLiga();

  const handleAceptarInscripcion = () => {
    aprobarInscripcion({
      aprobar: true,
      ligaId: idLiga,
      equipoId: equipoLiga.equipo.id,
    });
  };

  const handleEliminarEquipoDeLiga = async () => {
    const acepta = await confirm({
      title: "¿Estás seguro?",
      description:
        "Se eliminarán todos sus enfrentamientos. Esta acción no se puede deshacer",
    });
    if (acepta) {
      eliminarEquipo({
        equipoId: equipoLiga.equipo.id,
        ligaId: idLiga,
      });
    }
  };

  const handleMarcarPagado = async () => {
    const acepta = await confirm({
      title: "¿Estás seguro?",
      description: "Marcarás como pagado el equipo",
    });
    if (acepta) {
      marcarPagado({
        equipoId: equipoLiga.equipo.id,
        ligaId: idLiga,
      });
    }
  };

  return (
    <div
      className="bg-neutral-800/80 p-2 px-3 pl-5 rounded-lg relative flex flex-col overflow-hidden"
      onClick={onClick}
    >
      <div className="flex items-center">
        <p className="font-cool text-primary tracking-tight font-extrabold text-lg grow w-full">
          {equipoLiga.equipo.nombre}
        </p>
        {isAdmin && (
          <div className="w-min">
            <Button 
              icon={faTrash}
              variant="outline-neutral"
              onClick={handleEliminarEquipoDeLiga}
            ></Button>
          </div>
        )}
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
