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
      <div className={`${enfrentamiento.fecha ? 'text-neutral-300' : 'text-neutral-600'}`}>
        <FontAwesomeIcon icon={faCalendarDays} className="mr-1" />
        {enfrentamiento.fecha
          ? new Date(enfrentamiento.fecha).toLocaleDateString()
          : "Fecha no especificada"}
      </div>

      <div className={`${enfrentamiento.ubicacion ? 'text-neutral-300' : 'text-neutral-600'}`}>
        <FontAwesomeIcon icon={faLocationDot} className="mr-1" />
        {enfrentamiento.ubicacion || "Ubicación no especificada"}
      </div>
    </>
  );
};
