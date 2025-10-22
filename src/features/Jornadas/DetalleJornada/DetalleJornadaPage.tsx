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
    <div className="p-4 flex flex-col gap-3 max-w-screen-md mx-auto">
      <h1 className="text-3xl font-black font-cool text-primary underline underline-offset-2">
        {enfrentamiento.equipoA.nombre} vs {enfrentamiento.equipoB.nombre}
      </h1>

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
