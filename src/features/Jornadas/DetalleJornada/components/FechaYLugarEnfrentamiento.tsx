import { CalendarDays, MapPin } from "lucide-react";
import type { EnfrentamientoDTO } from "recreativos-air-core/enfrentamiento";
import { cn } from "@/lib/utils";

export const FechaYLugarEnfrentamiento = ({
  enfrentamiento,
}: {
  enfrentamiento: EnfrentamientoDTO;
}) => {
  return (
    <div className="flex flex-col gap-2 text-sm">
      <div
        className={cn(
          "flex items-center gap-2",
          enfrentamiento.fecha ? "text-foreground-soft" : "text-muted-foreground"
        )}
      >
        <CalendarDays size={16} className="shrink-0" aria-hidden="true" />
        <span>
          {enfrentamiento.fecha
            ? new Date(enfrentamiento.fecha).toLocaleDateString()
            : "Fecha no especificada"}
        </span>
      </div>

      <div
        className={cn(
          "flex items-center gap-2",
          enfrentamiento.ubicacion ? "text-foreground-soft" : "text-muted-foreground"
        )}
      >
        <MapPin size={16} className="shrink-0" aria-hidden="true" />
        <span>{enfrentamiento.ubicacion || "Ubicación no especificada"}</span>
      </div>
    </div>
  );
};
