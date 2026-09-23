import { ChevronRight, Medal } from "lucide-react";
import { Link } from "react-router";
import type { LigaDTO } from "recreativos-air-core/liga";
import { cn } from "@/lib/utils";
import { useClasificacionLiga } from "../../shared/api/ligas/useLigas";
import { logoFutbolinMap } from "../../shared/db/logoFutbolinMap";

const colorPos = (pos?: number) =>
  pos === 1
    ? "text-podium-1"
    : pos === 2
      ? "text-podium-2"
      : pos === 3
        ? "text-podium-3"
        : "text-foreground-soft";

/** Fila compacta de 52 px: logo · nombre · medalla + posición · chevron. */
export const FilaLigaAnteriorView = ({ liga, posicion }: { liga: LigaDTO; posicion?: number }) => (
  <Link
    to={`/competiciones/${liga.id}/clasificacion`}
    className="flex min-h-13 items-center gap-2.5 rounded-button border border-border bg-card-2 px-3 py-2 text-foreground transition-colors hover:border-input focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
  >
    <img
      src={logoFutbolinMap[liga.tipoFutbolin]}
      alt={liga.tipoFutbolin}
      className="size-[26px] shrink-0 object-contain opacity-80"
    />
    <span className="min-w-0 flex-1 truncate font-display text-[15px] font-semibold text-foreground-soft">
      {liga.nombre}
    </span>
    {posicion !== undefined && (
      <span className={cn("inline-flex items-center gap-1.5 text-xs font-bold", colorPos(posicion))}>
        <Medal size={14} aria-hidden="true" />
        {posicion}º
      </span>
    )}
    <ChevronRight size={18} className="shrink-0 text-muted-foreground" aria-hidden="true" />
  </Link>
);

const FilaLigaAnterior = ({ liga, equipoId }: { liga: LigaDTO; equipoId?: string }) => {
  const { data: clasificacion } = useClasificacionLiga(liga.id);
  const posicion = clasificacion?.find((r) => r.equipoId === equipoId)?.pos;
  return <FilaLigaAnteriorView liga={liga} posicion={posicion} />;
};

export const LigasAnteriores = ({ ligas, userId }: { ligas: LigaDTO[]; userId?: string }) => (
  <section className="flex flex-col gap-2.5">
    <h2 className="font-display text-sm font-bold tracking-[0.08em] text-muted-foreground uppercase">
      Ligas anteriores
    </h2>
    <ul className="flex flex-col gap-2">
      {ligas.map((l) => {
        const equipoId = l.equipos.find((e) =>
          e.equipo?.jugadores?.some((j) => j.idUsuario === userId)
        )?.equipo?.id;
        return (
          <li key={l.id}>
            <FilaLigaAnterior liga={l} equipoId={equipoId} />
          </li>
        );
      })}
    </ul>
  </section>
);
