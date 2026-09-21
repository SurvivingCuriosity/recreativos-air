import { EstadoLiga, type LigaDTO } from "recreativos-air-core/liga";
import type { EquipoDTO } from "recreativos-air-core/equipos";
import { EscudoEquipo } from "../../shared/components/EscudoEquipo/EscudoEquipo";
import { LigaProgress } from "../../shared/components/TarjetaLiga/LigaProgress";
import { PosicionUsuarioChip } from "../../shared/components/TarjetaLiga/PosicionUsuarioChip";

/** Panel lateral «mi equipo» del detalle de liga en desktop (design/screens/D-Liga.html). */
export const PanelMiEquipo = ({ liga, equipo }: { liga: LigaDTO; equipo: EquipoDTO }) => (
  <aside className="hidden flex-col gap-3 rounded-card border border-border bg-card p-4 lg:flex">
    <div className="flex items-center gap-2.5">
      <EscudoEquipo nombre={equipo.nombre} color={equipo.color} size={40} />
      <p className="truncate font-display text-lg font-bold text-primary-text">{equipo.nombre}</p>
    </div>
    <PosicionUsuarioChip
      ligaId={liga.id}
      equipoId={equipo.id}
      finalizada={liga.estadoLiga === EstadoLiga.Finalizada}
    />
    {liga.estadoLiga === EstadoLiga.EnCurso && (
      <LigaProgress ligaId={liga.id} myTeamId={equipo.id} />
    )}
  </aside>
);
