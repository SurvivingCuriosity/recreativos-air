import { CalendarDays, MapPin } from "lucide-react";
import { Icon } from "@/shared/ui/Icon";
import type { EnfrentamientoDTO } from "recreativos-air-core/enfrentamiento";

export const FechaYLugarEnfrentamiento = ({
  enfrentamiento,
}: {
  enfrentamiento: EnfrentamientoDTO;
}) => {
  return (
    <>
      <div className={`${enfrentamiento.fecha ? 'text-neutral-300' : 'text-neutral-600'}`}>
        <Icon icon={CalendarDays} className="mr-1" />
        {enfrentamiento.fecha
          ? new Date(enfrentamiento.fecha).toLocaleDateString()
          : "Fecha no especificada"}
      </div>

      <div className={`${enfrentamiento.ubicacion ? 'text-neutral-300' : 'text-neutral-600'}`}>
        <Icon icon={MapPin} className="mr-1" />
        {enfrentamiento.ubicacion || "Ubicación no especificada"}
      </div>
    </>
  );
};
