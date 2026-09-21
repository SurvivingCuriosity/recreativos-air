import { CalendarDays, MapPin } from "lucide-react";
import {
  EstadoEnfrentamiento,
  type EnfrentamientoDTO,
} from "recreativos-air-core/enfrentamiento";
import type { ConfiguracionLigaDTO } from "recreativos-air-core/liga";
import type { EquipoDTO } from "recreativos-air-core/equipos";
import { cn } from "@/lib/utils";
import { useAuth } from "../../api/auth/useAuth";
import { chipColorClass } from "../ChipEstado/ChipEstado";
import {
  equiposDelUsuarioEnEnfrentamiento,
  getEstadoEnfrentamientoInfo,
} from "./estadoEnfrentamiento";

/**
 * TarjetaEnfrentamiento (design/screens/LigaJornadas.html):
 * cabecera fecha · ubicación · estado (§6.4), columna de equipos con barra de color
 * y rejilla de marcador (celda ganadora resaltada, «-» si no se ha jugado).
 */
export const TarjetaEnfrentamiento = ({
  enfrentamiento,
  onClick,
  cfgLiga,
}: {
  enfrentamiento: EnfrentamientoDTO;
  onClick?: () => void;
  cfgLiga?: ConfiguracionLigaDTO;
}) => {
  const { user } = useAuth();
  const misEquipos = equiposDelUsuarioEnEnfrentamiento(enfrentamiento, user?.id);
  const estado = getEstadoEnfrentamientoInfo(enfrentamiento, user?.id);
  const sinJugar = enfrentamiento.estado === EstadoEnfrentamiento.SinJugar;
  const numPartidos = enfrentamiento.partidos.length;

  const esGanadora = (goles: number) =>
    !sinJugar && cfgLiga?.golesParaGanar !== undefined && goles === cfgLiga.golesParaGanar;

  const FilaEquipo = ({ equipo, ultima }: { equipo: EquipoDTO; ultima?: boolean }) => (
    <div
      className={cn(
        "flex min-h-11 items-center gap-2 px-2.5 py-[11px]",
        !ultima && "border-b border-border",
        misEquipos.includes(equipo.id) ? "text-primary-text" : "text-foreground"
      )}
    >
      <span
        aria-hidden="true"
        className="h-[18px] w-1 shrink-0 rounded-sm"
        style={{ backgroundColor: equipo.color || "var(--primary)" }}
      />
      <span title={equipo.nombre} className="truncate">
        {equipo.nombre}
      </span>
    </div>
  );

  const Celda = ({
    goles,
    ultimaFila,
    ultimaCol,
  }: {
    goles: number;
    ultimaFila?: boolean;
    ultimaCol?: boolean;
  }) => (
    <div
      className={cn(
        "flex min-h-11 items-center justify-center py-[11px] border-border",
        !ultimaFila && "border-b",
        !ultimaCol && "border-r",
        esGanadora(goles) ? "bg-primary/14 text-foreground" : "text-muted-foreground"
      )}
    >
      {sinJugar ? "-" : goles}
    </div>
  );

  return (
    <div
      onClick={onClick}
      role={onClick ? "link" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
      className={cn(
        "block overflow-hidden rounded-button border border-border bg-card text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        onClick && "cursor-pointer transition-colors hover:border-input"
      )}
    >
      <div className="flex items-center justify-between gap-2 bg-muted px-2.5 py-[7px] text-xs text-foreground-soft">
        <span className="inline-flex shrink-0 items-center gap-1.5">
          <CalendarDays size={13} aria-hidden="true" />
          <span>
            {enfrentamiento.fecha
              ? new Date(enfrentamiento.fecha).toLocaleDateString()
              : "-"}
          </span>
        </span>
        <span className="inline-flex min-w-0 items-center gap-1.5">
          <MapPin size={13} className="shrink-0" aria-hidden="true" />
          <span className="truncate">{enfrentamiento.ubicacion}</span>
        </span>
        <span
          className={cn(
            "shrink-0 font-bold whitespace-nowrap",
            chipColorClass[estado.color].split(" ")[0]
          )}
        >
          {estado.label}
        </span>
      </div>

      <div className="flex text-sm font-semibold">
        <div className="flex w-[46%] shrink-0 flex-col">
          <FilaEquipo equipo={enfrentamiento.equipoA} />
          <FilaEquipo equipo={enfrentamiento.equipoB} ultima />
        </div>
        <div
          className="grid flex-1 border-l border-border font-display text-base font-bold tabular-nums"
          style={{ gridTemplateColumns: `repeat(${numPartidos}, minmax(0, 1fr))` }}
        >
          {enfrentamiento.partidos.map((p, i) => (
            <Celda key={`a${i}`} goles={p.golesA} ultimaCol={i === numPartidos - 1} />
          ))}
          {enfrentamiento.partidos.map((p, i) => (
            <Celda
              key={`b${i}`}
              goles={p.golesB}
              ultimaFila
              ultimaCol={i === numPartidos - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
