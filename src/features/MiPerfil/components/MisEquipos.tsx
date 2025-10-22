import { EstadoJugadorEnEquipo } from "recreativos-air-core/equipos";
import { useGetEquiposUsuario } from "../../../shared/api/equipos/hooks/useGetEquipos";
import { TarjetaEquipo } from "../../../shared/components/TarjetaEquipo/TarjetaEquipo";

type Props = {
  idUsuario: string;
};

export const MisEquipos = ({ idUsuario }: Props) => {
  const {
    data: equiposUsuario,
    isLoading,
    error,
  } = useGetEquiposUsuario(idUsuario || "");

  if (isLoading)
    return (
      <p className="text-center p-8 text-neutral-500">Cargando equipos...</p>
    );

  if (error)
    return (
      <p className="text-center p-8 text-red-500">
        Ups... {String(error || "Algo pasó")}
      </p>
    );

  const equiposAceptados = equiposUsuario?.filter((e) =>
    e.jugadores.every((j) => j.estado !== EstadoJugadorEnEquipo.RECHAZADO)
  );

  if (!equiposAceptados || equiposAceptados?.length === 0)
    return (
      <div className="text-neutral-300 p-4 text-center bg-neutral-800/80 rounded-lg">
        <p className="p-3">No tienes equipos</p>
      </div>
    );

  return (
    <div className="relative">
      <ul className="flex items-center gap-2 overflow-x-auto w-full snap-x mb-2">
        {equiposAceptados.map((equipo, index) => (
          <div key={equipo.id + index} className="w-11/12 snap-start pb-2">
            <TarjetaEquipo key={index} equipo={equipo} onClick={() => {}} />
          </div>
        ))}
      </ul>
    </div>
  );
};
