import { Users } from "lucide-react";
import { type EquipoEnLigaDTO } from "recreativos-air-core/liga";
import { EscudoEquipo } from "../../../shared/components/EscudoEquipo/EscudoEquipo";

type Props = {
  equipoLiga: EquipoEnLigaDTO;
  onClick: () => void;
};

/** TarjetaEquipoLiga (design/screens/LigaEquipos.html): escudo 44 + nombre + jugadores. */
export const TarjetaEquipoLiga = ({ equipoLiga, onClick }: Props) => {
  const { equipo } = equipoLiga;
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-card border border-border bg-card px-3.5 py-3 text-left text-foreground transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
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
      </span>
    </button>
  );
};
