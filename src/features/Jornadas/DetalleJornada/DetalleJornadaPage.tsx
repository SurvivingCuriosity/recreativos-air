import { useParams } from "react-router";
import { useEnfrentamientoById } from "../../../shared/api/enfrentamientos/hooks";
import { BotonesAdmin } from "./components/BotonesAdmin";
import { BotonesUser } from "./components/BotonesUsers";
import { FechaYLugarEnfrentamiento } from "./components/FechaYLugarEnfrentamiento";
import { InfoEstadoEnfrentamiento } from "./components/InfoEstadoEnfrentamiento";
import { ResultadoEnfrentamiento } from "./components/ResultadoEnfrentamiento";

export const DetalleJornadaPage = () => {
  const params = useParams();
  const { id: idEnfrentamiento } = params;
  const { data: enfrentamiento, isLoading } = useEnfrentamientoById(
    idEnfrentamiento || ""
  );

  if (isLoading) {
    return (
      <p className="text-center p-10 text-neutral-500">Cargando liga...</p>
    );
  }
  if (enfrentamiento === undefined) {
    return (
      <p className="text-center p-10 text-red-500">
        Ups...Esta liga ya no existe
      </p>
    );
  }

  return (
    <div className="p-4 flex flex-col gap-3 w-full max-w-screen-sm mx-auto">
      <div className="relative flex flex-col gap-8 items-center text-xl font-black font-cool text-primary w-full overflow-x-hidden">
        <p className="uppercase font-cool mr-auto truncate w-full text-left">{enfrentamiento.equipoA.nombre}</p> 
        <span className="text-neutral-700 font-cool text-4xl absolute top-1/2 -translate-y-1/2">vs</span> 
        <p className="uppercase font-cool ml-auto truncate w-full text-right">{enfrentamiento.equipoB.nombre}</p>
      </div>

      {/* Datos básicos */}
      <FechaYLugarEnfrentamiento enfrentamiento={enfrentamiento} />

      {/* Estado visual */}
      <InfoEstadoEnfrentamiento enfrentamiento={enfrentamiento} />

      {/* Resultado */}
      <ResultadoEnfrentamiento enfrentamiento={enfrentamiento} />

      {/* 🧍‍♂️ Botones para jugadores */}
      <BotonesUser enfrentamiento={enfrentamiento} />

      {/* 🧑‍⚖️ Botón para admin */}
      <BotonesAdmin enfrentamiento={enfrentamiento} />
    </div>
  );
};
