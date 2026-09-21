import { EstadoLiga } from "recreativos-air-core/liga";
import { ChipEstado, type ChipColor } from "../ChipEstado/ChipEstado";

/** Estado de liga (DESIGN.md §4): En curso → magenta · Aún no ha comenzado → success · Finalizada → info. */
const estilos: Record<EstadoLiga, { label: string; color: ChipColor }> = {
  [EstadoLiga.EnCurso]: { label: "En curso", color: "neon" },
  [EstadoLiga.SinEmpezar]: { label: "Aún no ha comenzado", color: "success" },
  [EstadoLiga.Finalizada]: { label: "Finalizada", color: "info" },
};

export const ChipEstadoLiga = ({
  estado,
  className = "",
}: {
  estado: EstadoLiga;
  className?: string;
}) => {
  const { label, color } = estilos[estado];
  return (
    <ChipEstado color={color} className={className}>
      {label}
    </ChipEstado>
  );
};
