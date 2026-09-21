import { useNavigate } from "react-router";
import { EstadoJugadorEnEquipo } from "recreativos-air-core/equipos";
import { cn } from "@/lib/utils";
import { useGetEquiposUsuario } from "../../../shared/api/equipos/hooks/useGetEquipos";
import {
  EstadoError,
  EstadoVacio,
  SkeletonLista,
} from "../../../shared/components/Estados/Estados";
import { TarjetaEquipo } from "../../../shared/components/TarjetaEquipo/TarjetaEquipo";

type Props = {
  idUsuario: string;
};

/** Mis equipos: lista vertical si ≤3, carrusel si hay más (DESIGN.md §6.11). */
export const MisEquipos = ({ idUsuario }: Props) => {
  const {
    data: equiposUsuario,
    isLoading,
    error,
  } = useGetEquiposUsuario(idUsuario || "");

  const navigate = useNavigate();

  if (isLoading) return <SkeletonLista count={2} height="h-28" label="Cargando equipos..." />;

  if (error) return <EstadoError>Ups... {String(error || "Algo pasó")}</EstadoError>;

  const equiposAceptados = equiposUsuario?.filter((e) =>
    e.jugadores.every((j) => j.estado !== EstadoJugadorEnEquipo.RECHAZADO)
  );

  if (!equiposAceptados || equiposAceptados?.length === 0)
    return <EstadoVacio>No tienes equipos</EstadoVacio>;

  const carrusel = equiposAceptados.length > 3;

  return (
    <ul
      className={cn(
        "flex w-full gap-2.5",
        carrusel ? "-mr-4 snap-x overflow-x-auto pb-2 lg:mr-0" : "flex-col"
      )}
    >
      {equiposAceptados.map((equipo) => (
        <li key={equipo.id} className={cn(carrusel && "w-[88%] shrink-0 snap-start")}>
          <TarjetaEquipo equipo={equipo} onClick={() => navigate(`/equipos/${equipo.id}`)} />
        </li>
      ))}
    </ul>
  );
};
