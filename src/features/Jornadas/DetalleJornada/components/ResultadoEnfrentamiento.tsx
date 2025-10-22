import {
  faCheckCircle,
  faInfoCircle,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  EstadoEnfrentamiento,
  type EnfrentamientoDTO,
} from "recreativos-air-core/enfrentamiento";

export const ResultadoEnfrentamiento = ({
  enfrentamiento,
}: {
  enfrentamiento: EnfrentamientoDTO;
}) => {
  const equipoQuePropuso =
    enfrentamiento.equipoA.id === enfrentamiento.resultadoPropuestoPor
      ? enfrentamiento.equipoA
      : enfrentamiento.equipoB;

  const equipoQueAcepta =
    enfrentamiento.equipoA.id === enfrentamiento.resultadoAceptadoPor
      ? enfrentamiento.equipoA
      : enfrentamiento.equipoB;

  const equipoQueRechaza =
    enfrentamiento.equipoA.id === enfrentamiento.resultadoRechazadoPor
      ? enfrentamiento.equipoA
      : enfrentamiento.equipoB;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex text-xl justify-between w-full">
        <div className="border-neutral-700 flex flex-col">
          <p className="border-b border-neutral-700 py-2 px-2 truncate font-semibold">
            {enfrentamiento.equipoA.nombre}
          </p>
          <p className="py-2 px-2 truncate font-semibold">
            {enfrentamiento.equipoB.nombre}
          </p>
        </div>

        <div className="flex flex-row w-full justify-center overflow-x-auto">
          {enfrentamiento.partidos.map((p, index) => (
            <div
              key={`${index}-${enfrentamiento.id}`}
              className="text-xl flex flex-col border-neutral-700 text-neutral-400"
            >
              <p className="py-2 px-3 border-b border-neutral-700 text-center">
                {p.golesA ?? "-"}
              </p>
              <p className="py-2 px-3 text-center">{p.golesB ?? "-"}</p>
            </div>
          ))}
        </div>
      </div>

      {enfrentamiento.estado !== EstadoEnfrentamiento.Jugado && (
        <>
          {enfrentamiento.resultadoPropuestoPor !== null && (
            <div className="text-sm flex items-center gap-2 bg-neutral-900 p-3 rounded-lg">
              <FontAwesomeIcon
                icon={faInfoCircle}
                className="text-neutral-400"
              />
              <p className="text-neutral-400">
                Resultado propuesto por {equipoQuePropuso.nombre}
              </p>
            </div>
          )}
          {enfrentamiento.resultadoAceptadoPor !== null && (
            <div className="text-sm flex items-center gap-2 bg-green-900/50 p-3 rounded-lg">
              <FontAwesomeIcon
                icon={faCheckCircle}
                className="text-green-200"
              />
              <p className="text-green-200">
                Resultado aceptado por {equipoQueAcepta.nombre}
              </p>
            </div>
          )}
          {enfrentamiento.resultadoRechazadoPor !== null && (
            <div className="text-sm flex items-center gap-2 bg-red-900/50 p-3 rounded-lg">
              <FontAwesomeIcon icon={faXmarkCircle} className="text-red-200" />
              <p className="text-red-200">
                Resultado rechazado por {equipoQueRechaza.nombre}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};
