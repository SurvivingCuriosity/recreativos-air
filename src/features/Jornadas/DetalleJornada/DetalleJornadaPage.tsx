import {
    faCalendarDays,
    faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocation } from "react-router";
import { EstadoEnfrentamiento } from "../../../shared/enum/EstadoEnfrentamiento";
import type { Enfrentamiento } from "../../../shared/interfaces/Enfrentamiento";
import { Button } from "../../../packages/components/Button/Button";

export const DetalleJornadaPage = () => {
  const location = useLocation();
  const enfrentamiento = location.state.enfrentamiento as Enfrentamiento;

  return (
    <div className="p-4 flex flex-col gap-3">
      <h1 className="text-2xl font-black font-cool">Detalle Jornada</h1>
      <div className="text-neutral-400">
        <FontAwesomeIcon icon={faCalendarDays} className="mr-1" />
        {enfrentamiento.fecha ? enfrentamiento.fecha.toLocaleDateString() : "-"}
      </div>

      <div className="text-neutral-400">
        <FontAwesomeIcon icon={faLocationDot} className="mr-1" />
        {enfrentamiento.ubicacion}
      </div>

      {enfrentamiento.estado === EstadoEnfrentamiento.SinJugar ? (
        <div className="text-green-600">Pendiente</div>
      ) : enfrentamiento.estado === EstadoEnfrentamiento.Jugado ? (
        <div className="text-red-600">Jugado</div>
      ) : (
        <div className="text-orange-400">Confirmar resultado</div>
      )}

      <div className="flex text-xl justify-between w-full">
        <div className="border-neutral-700 flex flex-col">
          <p
            title={enfrentamiento.equipoA.nombre}
            className="border-b border-neutral-700 py-2 px-2 truncate"
          >
            {enfrentamiento.equipoA.nombre}
          </p>
          <p title={enfrentamiento.equipoB.nombre} className="py-2 px-2 truncate">
            {enfrentamiento.equipoB.nombre}
          </p>
        </div>

        <div className="flex flex-row w-full justify-center">
          {enfrentamiento.partidos.map((p, index) => (
            <div
              key={index + p.equipoA.nombre + p.equipoB.nombre}
              className="text-xl flex flex-col border-neutral-700 text-neutral-400"
            >
              <p className="py-2 px-3 border-b border-neutral-700">
                {p.golesA}
              </p>
              <p className="py-2 px-3">{p.golesB}</p>
            </div>
          ))}
        </div>
      </div>
      <Button onClick={() => {}} variant="outline">Confirmar resultado</Button>
    </div>
  );
};
