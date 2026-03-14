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
      <div className="flex justify-between w-full border border-neutral-800 rounded-2xl py-0 p-2 bg-neutral-950/60">
        <div className="max-w-32 w-full border-r border-neutral-700 flex flex-col">
          <p className="truncate w-full border-b border-neutral-700 py-2 font-semibold">
            {enfrentamiento.equipoA.nombre}
          </p>
          <p className="truncate w-full py-2 font-semibold">
            {enfrentamiento.equipoB.nombre}
          </p>
        </div>

        <div className="w-full flex flex-row justify-center overflow-x-auto">
          {enfrentamiento.partidos.map((p, index) => (
            <div
              key={`${index}-${enfrentamiento.id}`}
              className="w-full flex flex-col border-neutral-700 text-neutral-400"
            >
              <p className="p-2 border-b border-neutral-700 text-center">
                {p.golesA ?? "-"}
              </p>
              <p className="p-2 text-center">{p.golesB ?? "-"}</p>
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
