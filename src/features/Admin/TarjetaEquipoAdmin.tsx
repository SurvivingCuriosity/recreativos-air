import { Trophy, User } from "lucide-react";
import type { EquipoDTO } from "recreativos-air-core/equipos";
import type { LigaDTO } from "recreativos-air-core/liga";

const Etiqueta = ({ children }: { children: React.ReactNode }) => (
  <span className="text-[11px] font-bold tracking-[0.08em] text-muted-foreground uppercase">
    {children}
  </span>
);

/** TarjetaEquipoAdmin (design/screens/AdminEquipos.html). No clicable. */
export const TarjetaEquipoAdmin = ({
  equipo,
  ligas,
}: {
  equipo: EquipoDTO;
  ligas: LigaDTO[];
}) => {
  return (
    <div className="flex flex-col gap-2 rounded-card border border-border bg-card px-3.5 py-3 text-foreground">
      <span className="text-xs text-muted-foreground tabular-nums">#{equipo.id}</span>
      <p className="font-display text-[19px] font-bold text-primary-text">{equipo.nombre}</p>
      <div className="grid grid-cols-[3fr_2fr] gap-3">
        <div className="flex min-w-0 flex-col gap-1.5">
          <Etiqueta>Jugadores</Etiqueta>
          {equipo.jugadores.map((j, i) => (
            <span
              key={(j.idUsuario ?? j.nombre) + i}
              className="inline-flex min-w-0 items-center gap-1.5 text-sm text-foreground-soft"
            >
              <User size={14} className="shrink-0" aria-hidden="true" />
              <span className="truncate">{j.nombre}</span>
              {j.idUsuario === null && (
                <span className="shrink-0 text-xs text-muted-foreground">(No registrado)</span>
              )}
            </span>
          ))}
        </div>
        <div className="flex min-w-0 flex-col gap-1.5">
          <Etiqueta>Liga</Etiqueta>
          {ligas?.map((l) => (
            <span
              key={l.id}
              className="inline-flex min-w-0 items-center gap-1.5 text-sm text-foreground-soft"
            >
              <Trophy size={14} className="shrink-0" aria-hidden="true" />
              <span className="truncate">{l.nombre}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
