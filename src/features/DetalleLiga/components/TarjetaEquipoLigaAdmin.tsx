import {
  faChevronDown,
  faEuro,
  faEye,
  faHand,
  faTrash,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import {
  EstadoEquipoEnLiga,
  type EquipoEnLigaDTO,
} from "recreativos-air-core/liga";
import { Button } from "../../../packages/components/Button/Button";
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

export const TarjetaEquipoLigaAdmin = ({
  idLiga,
  equipoLiga,
  onClick,
}: Props) => {
  const { confirm } = useConfirmDialog();

  const pendiente = equipoLiga.estado === EstadoEquipoEnLiga.Pendiente;
  const pendienteDePago = equipoLiga.pagado === false;

  const { mutate: marcarPagado } = useMarcarPagado();
  const { mutate: aprobarInscripcion } = useAprobarInscripcion();
  const { mutate: eliminarEquipo } = useEliminarEquipoDeLiga();

  const [isOpened, setIsOpened] = useState(false);

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
    <div className="bg-neutral-800/80 p-2 px-3 pl-5 rounded-lg relative flex flex-col overflow-hidden">
      <div
        style={{
          backgroundColor: equipoLiga.equipo.color || "var(--color-primary)",
        }}
        className="absolute h-full left-0 w-2 top-0"
      ></div>

      {/* Cabecera: siempre visible */}
      <div
        className="flex items-center cursor-pointer py-1"
        onClick={() => setIsOpened(!isOpened)}
      >
        <div className="grow flex flex-col gap-1">
          <p className="font-cool text-primary tracking-tight font-extrabold text-lg">
            {equipoLiga.equipo.nombre}
          </p>
          <div className="flex items-center gap-2 text-neutral-400">
            <FontAwesomeIcon icon={faUsers} size="sm" />
            <p className="text-sm">
              {equipoLiga.equipo.jugadores.map((j) => j.nombre).join(", ")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {pendienteDePago && (
              <div className="absolute top-1 right-1 p-1 px-2 rounded bg-red-400/10 flex items-center gap-2 text-red-400">
                <FontAwesomeIcon icon={faEuro} />
              </div>
            )}
            {pendiente && (
              <div className="p-1 px-2 rounded bg-red-400/10 flex items-center gap-2 text-red-400">
                <FontAwesomeIcon icon={faHand} />
                <p className="text-xs">No aceptado</p>
              </div>
            )}
          </div>
        </div>
        <FontAwesomeIcon
          icon={faChevronDown}
          className="text-neutral-400 transition-transform duration-200"
          style={{ transform: isOpened ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </div>

      {/* Contenido desplegable */}
      <div
        className="grid"
        style={{
          gridTemplateRows: isOpened ? "1fr" : "0fr",
          transition: "grid-template-rows 0.2s ease-out",
        }}
      >
        <div className="overflow-hidden">
          <div className="flex flex-wrap items-center gap-2 pt-2 pb-1">
            
            <Button icon={faEye} variant="outline" onClick={onClick}>
              Ver equipo
            </Button>

            {pendienteDePago && (
              <Button variant="outline" onClick={handleMarcarPagado}>
                Marcar pagado
              </Button>
            )}
            
            {pendiente && (
              <Button onClick={handleAceptarInscripcion}>Aceptar</Button>
            )}

            <Button
              icon={faTrash}
              variant="outline-danger"
              onClick={handleEliminarEquipoDeLiga}
            >
              Eliminar de la liga
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
