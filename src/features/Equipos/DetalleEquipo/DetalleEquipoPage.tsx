import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useParams } from "react-router";
import { useGetEquipoById } from "../../../shared/api/equipos/hooks/useGetEquipoById";

export const DetalleEquipoPage = () => {
  const { id } = useParams();

  const { data: equipo, isLoading, error } = useGetEquipoById(id as string);

  if (isLoading)
    return (
      <p className="text-center p-10 text-neutral-500">Cargando equipo...</p>
    );
  if (error || equipo === undefined)
    return (
      <p className="text-center p-10 text-red-500">Ups... {String(error)}</p>
    );

  console.log(equipo);

  return (
    <div className="max-w-screen-sm mx-auto p-4 h-full z-4">
      <h1 className="font-cool text-3xl font-bold text-primary mb-4">
        {equipo.nombre}
      </h1>
      <ul className="border-neutral-700 flex flex-col items-start justify-center gap-3">
        {equipo.jugadores.map((jugador, index) => {
          if (jugador.idUsuario === null)
            return (
              <div key={jugador.nombre+index} className="justify-between w-full flex items-center gap-2 h-auto bg-neutral-800 min-w-40 p-2 px-4 rounded-md text-neutral-400">
                <p key={jugador.nombre} className="">
                  {jugador.nombre}
                </p>
                <p className="text-xs text-red-400">(No registrado)</p>
              </div>
            );
          return (
            <Link
              to={"/user/" + jugador.idUsuario}
              key={jugador.idUsuario + index}
              className="w-full flex-2/4h-auto bg-neutral-800 min-w-40 p-2 rounded-md text-neutral-400"
            >
              <FontAwesomeIcon icon={faUser} className="mr-1" />
              {jugador.nombre}
            </Link>
          );
        })}
      </ul>
    </div>
  );
};
