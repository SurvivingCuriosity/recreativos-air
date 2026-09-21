import { CircleCheck, Hand, Info, type LucideIcon } from "lucide-react";
import {
  EstadoEnfrentamiento,
  type EnfrentamientoDTO,
} from "recreativos-air-core/enfrentamiento";
import { cn } from "@/lib/utils";
import { useAuth } from "../../../../shared/api/auth/useAuth";
import { chipColorClass } from "../../../../shared/components/ChipEstado/ChipEstado";
import {
  equiposDelUsuarioEnEnfrentamiento,
  getEstadoEnfrentamientoInfo,
} from "../../../../shared/components/TarjetaEnfrentamiento/estadoEnfrentamiento";

/**
 * Caja de estado del enfrentamiento (DESIGN.md §6.4): mismo vocabulario que chip y filtro.
 * «Debes aceptar o rechazar el resultado» solo se muestra a quien puede hacerlo.
 */
export const InfoEstadoEnfrentamiento = ({
  enfrentamiento,
}: {
  enfrentamiento: EnfrentamientoDTO;
}) => {
  const { user } = useAuth();
  const info = getEstadoEnfrentamientoInfo(enfrentamiento, user?.id);
  const misEquipos = equiposDelUsuarioEnEnfrentamiento(enfrentamiento, user?.id);
  const propuestoPorMiEquipo =
    enfrentamiento.resultadoPropuestoPor !== null &&
    misEquipos.includes(enfrentamiento.resultadoPropuestoPor);

  const description: Record<EstadoEnfrentamiento, string> = {
    [EstadoEnfrentamiento.SinJugar]: "Este partido no ha sido jugado aún.",
    [EstadoEnfrentamiento.CorroborarResultado]: info.debeResponder
      ? "Debes aceptar o rechazar el resultado"
      : propuestoPorMiEquipo
        ? "El resultado debe ser confirmado por la otra pareja."
        : "Resultado pendiente de respuesta del rival.",
    [EstadoEnfrentamiento.ConfirmarResultado]:
      "El administrador debe confirmar finalmente el resultado.",
    [EstadoEnfrentamiento.Jugado]: "El partido ha finalizado.",
  };

  const icon: Record<EstadoEnfrentamiento, LucideIcon> = {
    [EstadoEnfrentamiento.SinJugar]: Info,
    [EstadoEnfrentamiento.CorroborarResultado]: Hand,
    [EstadoEnfrentamiento.ConfirmarResultado]: Hand,
    [EstadoEnfrentamiento.Jugado]: CircleCheck,
  };

  const IconComp = icon[enfrentamiento.estado];

  return (
    <div
      role="status"
      className={cn(
        "flex w-full items-center gap-3 rounded-button border px-3.5 py-3",
        chipColorClass[info.color]
      )}
    >
      <IconComp size={22} className="shrink-0" aria-hidden="true" />
      <div className="flex flex-col gap-0.5">
        <p className="font-display text-base font-bold">{info.label}</p>
        <p className="text-[13px] text-foreground">{description[enfrentamiento.estado]}</p>
      </div>
    </div>
  );
};
