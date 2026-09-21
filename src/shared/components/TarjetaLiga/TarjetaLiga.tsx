import { Users } from "lucide-react";
import { useNavigate } from "react-router";
import {
  EstadoEquipoEnLiga,
  EstadoLiga,
  type LigaDTO,
} from "recreativos-air-core/liga";
import { toast } from "@/shared/lib/toast";
import { cn } from "@/lib/utils";
import { Button } from "../../../packages/components/Button/Button";
import { useAuth } from "../../api/auth/useAuth";
import { useGetEquiposUsuario } from "../../api/equipos/hooks/useGetEquipos";
import { useInscribirEquipo } from "../../api/ligas/useLigas";
import { useTemporadas } from "../../api/temporadas/useTemporadas";
import { useConfirmDialog } from "../../context/UIProvider/hooks/useUI";
import { useWindow } from "../../context/WindowProvider";
import { fondoFutbolinMap } from "../../db/fondoFutbolinMap";
import { logoFutbolinMap } from "../../db/logoFutbolinMap";
import { useIsInscritoALiga } from "../../hooks/useIsInscritoALiga";
import { ChipEstado } from "../ChipEstado/ChipEstado";
import { SelectorEquipoUsuario } from "../SelectorEquipoUsuario/SelectorEquipoUsuario";
import { ChipEstadoLiga } from "./ChipEstadoLiga";
import { LigaProgress } from "./LigaProgress";
import { PosicionUsuarioChip } from "./PosicionUsuarioChip";

export interface TarjetaLigaProps {
  liga: LigaDTO;
  onClick?: () => void;
  className?: string;
}

/**
 * TarjetaLiga (design/screens/Competiciones.html): borde degradado naranja→magenta,
 * foto del futbolín a la derecha con degradado, radio 22 px.
 * Se mantiene oscura también en modo claro (clase `dark` local) con sombra dura.
 */
export const TarjetaLiga = ({ liga, onClick, className }: TarjetaLigaProps) => {
  const { user, isLoggedIn } = useAuth();
  const { close, show } = useWindow();
  const { confirm } = useConfirmDialog();
  const navigate = useNavigate();
  const { data: temporadas } = useTemporadas();
  const { data: equiposUsuario } = useGetEquiposUsuario(user?.id || "");
  const { mutate: inscribirEquipo } = useInscribirEquipo();

  const estaInscrito = useIsInscritoALiga(liga);
  const equipoUsuario = liga.equipos?.find((e) =>
    e.equipo?.jugadores?.some((j) => j.idUsuario === user?.id)
  );
  const pendienteDeAceptar =
    equipoUsuario?.estado === EstadoEquipoEnLiga.Pendiente;

  const numEquipos =
    liga.equipos?.filter((e) => e.estado === EstadoEquipoEnLiga.Aprobado).length ?? 0;
  const nombreTemporada = temporadas?.find((t) => t.id === liga.temporada)?.nombre;

  const handleClickInscribir = async () => {
    if (!liga) {
      toast.error("Error al cargar liga");
      return;
    }
    // §6.9: con un solo equipo se salta el selector y se confirma directamente
    if (equiposUsuario?.length === 1) {
      const equipo = equiposUsuario[0];
      const ok = await confirm({
        title: `¿Inscribir a ${equipo.nombre}?`,
        description: `Se inscribirá a ${equipo.nombre} en ${liga.nombre}.`,
        confirmText: "Inscribirme",
        variant: "default",
      });
      if (ok) inscribirEquipo({ equipoId: equipo.id, ligaId: liga.id });
      return;
    }
    show(
      <SelectorEquipoUsuario
        onSelect={(equipoId) => {
          inscribirEquipo({ equipoId, ligaId: liga.id });
          close();
        }}
        onCancel={() => close()}
      />,
      "Elige un equipo"
    );
  };

  const mostrarInscribirme =
    (isLoggedIn && !estaInscrito && liga.estadoLiga === EstadoLiga.SinEmpezar) ||
    !isLoggedIn;

  return (
    <div
      onClick={onClick}
      role={onClick ? "link" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ") && e.target === e.currentTarget) {
          e.preventDefault();
          onClick();
        }
      }}
      className={cn(
        "dark relative block h-full w-full overflow-hidden rounded-liga border-gradient-liga text-foreground shadow-hard-lg transition-transform focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        onClick && "cursor-pointer hover:brightness-110",
        className
      )}
    >
      <img
        src={fondoFutbolinMap[liga.tipoFutbolin]}
        alt=""
        aria-hidden="true"
        className="absolute top-0 right-0 h-full w-[70%] object-cover object-right opacity-85"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,var(--card)_30%,rgb(22_22_22/0.7)_62%,rgb(255_79_163/0.08)_100%)]"
      />

      <div className="relative flex h-full flex-col gap-3 px-4 pt-3.5 pb-4">
        <div className="flex items-center gap-2.5">
          <img
            src={logoFutbolinMap[liga.tipoFutbolin]}
            alt={liga.tipoFutbolin}
            className="size-9 shrink-0 object-contain"
          />
          <p className="font-display text-[19px] leading-[1.15] font-bold text-primary-text text-glow-liga">
            {liga.nombre}
          </p>
          <ChipEstadoLiga estado={liga.estadoLiga} className="ml-auto self-start" />
        </div>

        {equipoUsuario?.equipo?.id && (
          <PosicionUsuarioChip
            ligaId={liga.id}
            equipoId={equipoUsuario.equipo.id}
            finalizada={liga.estadoLiga === EstadoLiga.Finalizada}
          />
        )}

        {liga.estadoLiga === EstadoLiga.EnCurso && (
          <LigaProgress ligaId={liga.id} myTeamId={equipoUsuario?.equipo?.id} />
        )}

        {liga.estadoLiga === EstadoLiga.SinEmpezar && (
          <p className="flex items-center gap-1.5 text-[13px] text-foreground-soft">
            <Users size={14} aria-hidden="true" />
            <span>
              {numEquipos} equipos{nombreTemporada ? ` · ${nombreTemporada}` : ""}
            </span>
          </p>
        )}

        {mostrarInscribirme && (
          <div className="flex">
            <Button
              variant="outline-neutral"
              className="w-auto"
              onClick={isLoggedIn ? handleClickInscribir : () => navigate("/login")}
            >
              Inscribirme
            </Button>
          </div>
        )}

        {pendienteDeAceptar && (
          <div className="flex">
            <ChipEstado color="warning">Esperando confirmación...</ChipEstado>
          </div>
        )}
      </div>
    </div>
  );
};
