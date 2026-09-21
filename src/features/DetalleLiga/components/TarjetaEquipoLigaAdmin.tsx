import { ChevronDown, Euro, Eye, Hand, Trash2, Users } from "lucide-react";
import { useState } from "react";
import {
  EstadoEquipoEnLiga,
  type EquipoEnLigaDTO,
} from "recreativos-air-core/liga";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { Button } from "../../../packages/components/Button/Button";
import {
  useAprobarInscripcion,
  useEliminarEquipoDeLiga,
  useMarcarPagado,
} from "../../../shared/api/ligas/useLigas";
import { ChipEstado } from "../../../shared/components/ChipEstado/ChipEstado";
import { EscudoEquipo } from "../../../shared/components/EscudoEquipo/EscudoEquipo";
import { useConfirmDialog } from "../../../shared/context/UIProvider/hooks/useUI";

type Props = {
  idLiga: string;
  equipoLiga: EquipoEnLigaDTO;
  onClick: () => void;
};

/** TarjetaEquipoLigaAdmin (design/screens/LigaEquiposAdmin.html): acordeón con acciones. */
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
      variant: "default",
    });
    if (acepta) {
      marcarPagado({
        equipoId: equipoLiga.equipo.id,
        ligaId: idLiga,
      });
    }
  };

  const { equipo } = equipoLiga;

  return (
    <Collapsible
      open={isOpened}
      onOpenChange={setIsOpened}
      className={cn(
        "overflow-hidden rounded-card border bg-card text-foreground",
        isOpened ? "border-input" : "border-border"
      )}
    >
      <CollapsibleTrigger className="flex w-full items-center gap-3 px-3.5 py-3 text-left focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring">
        <EscudoEquipo nombre={equipo.nombre} color={equipo.color} size={44} />
        <span className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="truncate font-display text-[17px] font-bold text-primary-text">
            {equipo.nombre}
          </span>
          <span className="inline-flex items-center gap-1.5 text-[13px] text-foreground-soft">
            <Users size={14} className="shrink-0" aria-hidden="true" />
            <span className="truncate">
              {equipo.jugadores.map((j) => j.nombre).join(", ")}
            </span>
          </span>
          {pendiente && (
            <span className="flex">
              <ChipEstado color="destructive" icon={Hand}>
                No aceptado
              </ChipEstado>
            </span>
          )}
        </span>
        {pendienteDePago && (
          <span
            aria-label="Pendiente de pago"
            title="Pendiente de pago"
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-input border border-destructive/35 bg-destructive/13 text-destructive"
          >
            <Euro size={16} aria-hidden="true" />
          </span>
        )}
        <ChevronDown
          size={20}
          aria-hidden="true"
          className={cn(
            "shrink-0 text-muted-foreground transition-transform duration-200",
            isOpened && "rotate-180"
          )}
        />
      </CollapsibleTrigger>

      <CollapsibleContent className="data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0">
        <div className="flex flex-wrap items-center gap-2 border-t border-border px-3.5 py-3">
          <Button icon={Eye} variant="outline" className="w-auto" onClick={onClick}>
            Ver equipo
          </Button>

          {pendienteDePago && (
            <Button variant="outline" className="w-auto" onClick={handleMarcarPagado}>
              Marcar pagado
            </Button>
          )}

          {pendiente && (
            <Button className="w-auto" onClick={handleAceptarInscripcion}>
              Aceptar
            </Button>
          )}

          <Button
            icon={Trash2}
            variant="outline-danger"
            className="w-auto"
            onClick={handleEliminarEquipoDeLiga}
          >
            Eliminar de la liga
          </Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
