import { faCalendarDays, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { EnfrentamientoDTO } from "recreativos-air-core/enfrentamiento";

export const FechaYLugarEnfrentamiento = ({
  enfrentamiento,
}: {
  enfrentamiento: EnfrentamientoDTO;
}) => {
  return (
    <>
      <div className="text-neutral-400">
        <FontAwesomeIcon icon={faCalendarDays} className="mr-1" />
        {enfrentamiento.fecha
          ? new Date(enfrentamiento.fecha).toLocaleDateString()
          : "-"}
      </div>

      <div className="text-neutral-400">
        <FontAwesomeIcon icon={faLocationDot} className="mr-1" />
        {enfrentamiento.ubicacion || "-"}
      </div>
    </>
  );
};
