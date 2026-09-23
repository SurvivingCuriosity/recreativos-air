import { ChevronRight, Users } from "lucide-react";
import { useNavigate } from "react-router";
import { EstadoEnfrentamiento } from "recreativos-air-core/enfrentamiento";
import type { EquipoDTO } from "recreativos-air-core/equipos";
import { EstadoEquipoEnLiga, EstadoLiga, type LigaDTO } from "recreativos-air-core/liga";
import { cn } from "@/lib/utils";
import { useAuth } from "../../shared/api/auth/useAuth";
import { useEnfrentamientosLiga } from "../../shared/api/enfrentamientos/hooks";
import { useClasificacionLiga } from "../../shared/api/ligas/useLigas";
import { useTemporadas } from "../../shared/api/temporadas/useTemporadas";
import { ChipEstado } from "../../shared/components/ChipEstado/ChipEstado";
import { ProgressBar } from "../../shared/components/ProgressBar/ProgressBar";
import { ChipEstadoLiga } from "../../shared/components/TarjetaLiga/ChipEstadoLiga";
import { fondoFutbolinMap } from "../../shared/db/fondoFutbolinMap";
import { logoFutbolinMap } from "../../shared/db/logoFutbolinMap";

export interface HeroDatos {
  posicion?: number;
  progresoLiga?: number;
  progresoMio?: number;
  sinJugar?: number;
  jugados?: number;
  numEquipos?: number;
  temporada?: string;
  esperandoConfirmacion?: boolean;
  esAdmin?: boolean;
}

/** Vista de TarjetaLigaHero (design/home-v3): posición en grande, progreso, stats y «Ver liga». */
export const TarjetaLigaHeroView = ({
  liga,
  datos,
  onClick,
  className,
}: {
  liga: LigaDTO;
  datos: HeroDatos;
  onClick?: () => void;
  className?: string;
}) => {
  const sinEmpezar = liga.estadoLiga === EstadoLiga.SinEmpezar;
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
        "dark relative block w-full overflow-hidden rounded-[24px] border-gradient-liga text-foreground shadow-hard-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        onClick && "cursor-pointer hover:brightness-110",
        className
      )}
    >
      <img
        src={fondoFutbolinMap[liga.tipoFutbolin]}
        alt=""
        aria-hidden="true"
        className="absolute top-0 right-0 h-full w-[78%] object-cover object-right opacity-90"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,var(--card)_28%,rgb(22_22_22/0.72)_58%,rgb(255_79_163/0.10)_100%)]"
      />

      <div className="relative flex flex-col gap-4 px-4 pt-4 pb-[18px]">
        <div className="flex items-center gap-2.5">
          <img
            src={logoFutbolinMap[liga.tipoFutbolin]}
            alt={liga.tipoFutbolin}
            className="size-10 shrink-0 object-contain"
          />
          <p className="min-w-0 font-display text-[22px] leading-[1.1] font-bold text-primary-text text-glow-liga">
            {liga.nombre}
          </p>
          <ChipEstadoLiga estado={liga.estadoLiga} className="ml-auto shrink-0 self-start" />
        </div>

        {sinEmpezar ? (
          <>
            {datos.esperandoConfirmacion && (
              <div className="flex">
                <ChipEstado color="warning">Esperando confirmación...</ChipEstado>
              </div>
            )}
            <span className="inline-flex items-center gap-1.5 text-[13px] text-foreground-soft">
              <Users size={14} aria-hidden="true" />
              <span>
                {datos.numEquipos ?? 0} equipos{datos.temporada ? ` · ${datos.temporada}` : ""}
              </span>
            </span>
          </>
        ) : (
          <>
            {datos.posicion !== undefined && (
              <div className="flex items-baseline gap-2">
                <span className="font-display text-[56px] leading-[0.9] font-bold text-foreground [text-shadow:0_0_14px_rgb(235_138_31/0.35)]">
                  {datos.posicion}º
                </span>
                <span className="text-sm font-semibold text-foreground-soft">Puesto</span>
              </div>
            )}
            <div className="flex flex-col gap-2 pr-2">
              {datos.esAdmin && datos.progresoLiga !== undefined && (
                <ProgressBar progress={datos.progresoLiga} label="Liga" />
              )}
              {datos.progresoMio !== undefined && (
                <ProgressBar progress={datos.progresoMio} label="Has jugado" />
              )}
            </div>
          </>
        )}

        <div className="flex items-center justify-between gap-3">
          {!sinEmpezar && datos.sinJugar !== undefined && (
            <span className="inline-flex gap-3 text-[13px] text-foreground-soft">
              <span>
                <b className="font-bold text-foreground">{datos.sinJugar}</b> sin jugar
              </span>
              <span>
                <b className="font-bold text-foreground">{datos.jugados ?? 0}</b> jugados
              </span>
            </span>
          )}
          <span className="ml-auto inline-flex items-center gap-1 text-[13px] font-bold text-primary-text">
            Ver liga
            <ChevronRight size={16} aria-hidden="true" />
          </span>
        </div>
      </div>
    </div>
  );
};

/** Contenedor con datos reales (clasificación, enfrentamientos, temporadas). */
export const TarjetaLigaHero = ({ liga, equipo }: { liga: LigaDTO; equipo?: EquipoDTO }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: clasificacion } = useClasificacionLiga(liga.id);
  const { data: enfrentamientos = [] } = useEnfrentamientosLiga(liga.id);
  const { data: temporadas } = useTemporadas();

  const posicion = clasificacion?.find((r) => r.equipoId === equipo?.id)?.pos;
  const mios = enfrentamientos.filter(
    (e) => e.equipoA.id === equipo?.id || e.equipoB.id === equipo?.id
  );
  const jugados = mios.filter((e) => e.estado === EstadoEnfrentamiento.Jugado).length;
  const sinJugar = mios.filter((e) => e.estado === EstadoEnfrentamiento.SinJugar).length;
  const totalJugados = enfrentamientos.filter((e) => e.estado === EstadoEnfrentamiento.Jugado).length;

  const equipoLiga = liga.equipos.find((e) => e.equipo?.id === equipo?.id);

  return (
    <TarjetaLigaHeroView
      liga={liga}
      onClick={() => navigate(`/competiciones/${liga.id}/clasificacion`)}
      datos={{
        posicion,
        progresoLiga: enfrentamientos.length ? (totalJugados / enfrentamientos.length) * 100 : undefined,
        progresoMio: mios.length ? (jugados / mios.length) * 100 : undefined,
        sinJugar: mios.length ? sinJugar : undefined,
        jugados,
        numEquipos: liga.equipos.filter((e) => e.estado === EstadoEquipoEnLiga.Aprobado).length,
        temporada: temporadas?.find((t) => t.id === liga.temporada)?.nombre,
        esperandoConfirmacion: equipoLiga?.estado === EstadoEquipoEnLiga.Pendiente,
        esAdmin: !!user?.admin,
      }}
    />
  );
};
