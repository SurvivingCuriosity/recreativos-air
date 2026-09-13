import { EstadoLiga } from "recreativos-air-core/liga";

const estilos: Record<EstadoLiga, { label: string; className: string }> = {
  [EstadoLiga.EnCurso]: {
    label: "En curso",
    className: "text-orange-400 bg-orange-500/20",
  },
  [EstadoLiga.SinEmpezar]: {
    label: "Aún no ha comenzado",
    className: "text-green-400 bg-green-500/20",
  },
  [EstadoLiga.Finalizada]: {
    label: "Finalizada",
    className: "text-sky-400 bg-sky-500/20",
  },
};

export const ChipEstadoLiga = ({
  estado,
  className = "",
}: {
  estado: EstadoLiga;
  className?: string;
}) => {
  const { label, className: color } = estilos[estado];

  return (
    <p
      className={`w-fit px-1 text-xs rounded-md whitespace-nowrap ${color} ${className}`}
    >
      {label}
    </p>
  );
};
