import { Medal, ShieldHalf, Trophy, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useClasificacionLiga } from "../../api/ligas/useLigas";

interface PosicionUsuarioChipProps {
  ligaId: string;
  equipoId?: string;
  finalizada?: boolean;
}

/** Píldora de posición del usuario. Podio con los colores de DESIGN.md §4. */
export const PosicionUsuarioChip = ({
  ligaId,
  equipoId,
  finalizada = false,
}: PosicionUsuarioChipProps) => {
  const { data: clasificacion } = useClasificacionLiga(ligaId);

  if (!equipoId || !clasificacion) return null;

  const posicion = clasificacion.find((r) => r.equipoId === equipoId);

  if (!posicion) return null;

  const { pos } = posicion;

  const estilo: { icon: LucideIcon; className: string } =
    pos === 1
      ? { icon: Trophy, className: "text-podium-1 bg-podium-1/10 border-podium-1/28" }
      : pos === 2
        ? { icon: Medal, className: "text-podium-2 bg-podium-2/10 border-podium-2/28" }
        : pos === 3
          ? { icon: Medal, className: "text-podium-3 bg-podium-3/10 border-podium-3/28" }
          : { icon: ShieldHalf, className: "text-foreground-soft bg-muted border-border" };

  const label = finalizada
    ? pos === 1
      ? "¡Campeones! Has quedado 1º"
      : `Has quedado ${pos}º`
    : `${pos}º Puesto`;

  return (
    <div
      className={cn(
        "flex w-fit items-center gap-1.5 rounded-full border px-3 py-[5px] text-xs font-bold",
        estilo.className
      )}
    >
      <estilo.icon size={14} strokeWidth={2} aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
};
