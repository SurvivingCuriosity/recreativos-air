import {
  faCalendarDays,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocation } from "react-router";
import { Button } from "../../../packages/components/Button/Button";
import { EstadoEnfrentamiento } from "../../../shared/enum/EstadoEnfrentamiento";
import type { Enfrentamiento } from "../../../shared/interfaces/Enfrentamiento";
import { useAppSelector } from "../../../shared/store/hooks";
import { BotonIntroducirResultado } from "./components/BotonIntroducirResultado";
import { useState } from "react";

export const DetalleJornadaPage = () => {
  const location = useLocation();
  const enfrentamiento = location.state.enfrentamiento as Enfrentamiento;
  const loggedInUser = useAppSelector((state) => state.auth.user);
  const usuarioParticipa =
    enfrentamiento.equipoA.jugadores.find(
      (j) => j.idUsuario === loggedInUser?.id
    ) ||
    enfrentamiento.equipoB.jugadores.find(
      (j) => j.idUsuario === loggedInUser?.id
    );

  const [enfrentamientoState, setEnfrentamientoState] =
    useState<Enfrentamiento>(enfrentamiento);

  return (
    <div className="p-4 flex flex-col gap-3">
      <h1 className="text-2xl font-black font-cool">Detalle Jornada</h1>
      <div className="text-neutral-400">
        <FontAwesomeIcon icon={faCalendarDays} className="mr-1" />
        {enfrentamientoState.fecha ? enfrentamientoState.fecha.toLocaleDateString() : "-"}
      </div>

      <div className="text-neutral-400">
        <FontAwesomeIcon icon={faLocationDot} className="mr-1" />
        {enfrentamientoState.ubicacion}
      </div>

      {enfrentamientoState.estado === EstadoEnfrentamiento.SinJugar ? (
        <div className="text-green-600">No jugado</div>
      ) : enfrentamientoState.estado === EstadoEnfrentamiento.Jugado ? (
        <div className="text-red-600">Jugado</div>
      ) : (
        <div className="text-orange-400">Pendiente</div>
      )}

      <div className="flex text-xl justify-between w-full">
        <div className="border-neutral-700 flex flex-col">
          <p
            title={enfrentamientoState.equipoA.nombre}
            className="border-b border-neutral-700 py-2 px-2 truncate"
          >
            {enfrentamientoState.equipoA.nombre}
          </p>
          <p
            title={enfrentamientoState.equipoB.nombre}
            className="py-2 px-2 truncate"
          >
            {enfrentamientoState.equipoB.nombre}
          </p>
        </div>

        <div className="flex flex-row w-full justify-center overflow-x-auto">
          {enfrentamientoState.partidos.map((p, index) => (
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
      {loggedInUser?.admin === true &&
        enfrentamientoState.estado === EstadoEnfrentamiento.ConfirmarResultado && (
          <Button onClick={() => {}} variant="outline">
            Confirmar resultado
          </Button>
        )}
      <BotonIntroducirResultado
        enfrentamiento={enfrentamientoState}
        usuarioParticipa={usuarioParticipa}
        onUpdateEnfrentamiento={setEnfrentamientoState}
      />
    </div>
  );
};
