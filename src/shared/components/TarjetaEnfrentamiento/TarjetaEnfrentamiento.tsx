import {
  faCalendarDays,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { EstadoEnfrentamiento, type EnfrentamientoDTO } from "recreativos-air-core/enfrentamiento";
import { useAuth } from "../../api/auth/useAuth";
import { useGetEquiposUsuario } from "../../api/equipos/hooks/useGetEquipos";

export const TarjetaEnfrentamiento = ({
  enfrentamiento,
  onClick,
}: {
  enfrentamiento: EnfrentamientoDTO;
  onClick?: () => void;
}) => {
  const { user } = useAuth();
  const { data: equiposUsuario } = useGetEquiposUsuario(user?.id || "");

  return (
    <>
      <div
        onClick={onClick}
        className="border rounded-md bg-neutral-900/50 border-neutral-700 overflow-hidden"
      >
        <div className="flex justify-between p-1 text-xs bg-neutral-800 rounded-t-md text-neutral-300 ">
          <div className="text-neutral-300 w-3/12">
            <FontAwesomeIcon icon={faCalendarDays} className="mr-1" />
            {enfrentamiento.fecha
              ? new Date(enfrentamiento.fecha).toLocaleDateString()
              : "-"}
          </div>

          <div className="text-neutral-300 w-6/12 text-center">
            <FontAwesomeIcon icon={faLocationDot} className="mr-1" />
            {enfrentamiento.ubicacion}
          </div>

          {enfrentamiento.estado === EstadoEnfrentamiento.SinJugar ? (
            <div className="text-red-600 text-right w-3/12">No jugado</div>
          ) : enfrentamiento.estado === EstadoEnfrentamiento.Jugado ? (
            <div className="text-green-600 text-right w-3/12">Jugado</div>
          ) : enfrentamiento.estado ===
            EstadoEnfrentamiento.CorroborarResultado ? (
            <div className="text-orange-300 text-right w-3/12">
              Corroborar resultado
            </div>
          ) : (
            <div className="text-yellow-300 text-right w-3/12">
              Confirmar resultado
            </div>
          )}
        </div>
        <div className="flex text-sm justify-between">
          <div className={`flex flex-col min-w-28`}>
            <div className="relative w-45 truncate">
              <p
                title={enfrentamiento.equipoA.nombre}
                className={`${
                  equiposUsuario?.some(
                    (e) => e.id === enfrentamiento.equipoA.id
                  )
                    ? "text-primary"
                    : ""
                }  border-b border-neutral-700 py-2 px-2 truncate`}
              >
                {enfrentamiento.equipoA.nombre}
              </p>
              <div
                style={{ backgroundColor: enfrentamiento.equipoA.color }}
                className="absolute top-0 left-0 h-full w-1"
              ></div>
            </div>
            <div className="relative w-45 truncate">
              <p
                title={enfrentamiento.equipoB.nombre}
                className={`${
                  equiposUsuario?.some(
                    (e) => e.id === enfrentamiento.equipoB.id
                  )
                    ? "text-primary"
                    : ""
                } py-2 px-2 truncate`}
              >
                {enfrentamiento.equipoB.nombre}
              </p>
              <div
                style={{ backgroundColor: enfrentamiento.equipoB.color }}
                className="absolute top-0 left-0 h-full w-1"
              ></div>
            </div>
          </div>

          <div className="flex flex-row border-l border-neutral-700 overflow-x-auto mr-auto">
            {enfrentamiento.partidos.map((p, index) => (
              <div
                key={
                  index +
                  enfrentamiento.equipoA.nombre +
                  enfrentamiento.equipoB.nombre
                }
                className="flex flex-col border-r border-neutral-700 text-neutral-300"
              >
                <p className="py-2 px-3 border-b border-neutral-700">
                  {enfrentamiento.estado === EstadoEnfrentamiento.SinJugar
                    ? "-"
                    : p.golesA}
                </p>
                <p className="py-2 px-3">
                  {enfrentamiento.estado === EstadoEnfrentamiento.SinJugar
                    ? "-"
                    : p.golesB}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
