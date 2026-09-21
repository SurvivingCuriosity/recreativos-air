import { ChevronRight, User } from "lucide-react";
import { Link, useParams } from "react-router";
import { useAuth } from "../../../shared/api/auth/useAuth";
import { useGetEquipoById } from "../../../shared/api/equipos/hooks/useGetEquipoById";
import { EscudoEquipo } from "../../../shared/components/EscudoEquipo/EscudoEquipo";
import { EstadoError, SkeletonLista } from "../../../shared/components/Estados/Estados";
import { PageTitle } from "../../../shared/components/Titulos/Titulos";

export const DetalleEquipoPage = () => {
  const { id } = useParams();

  const { user } = useAuth();

  const { data: equipo, isLoading, error } = useGetEquipoById(id as string);

  if (isLoading)
    return (
      <main className="mx-auto w-full max-w-screen-sm px-4 pt-[18px]">
        <SkeletonLista count={3} height="h-13" label="Cargando equipo..." />
      </main>
    );
  if (error || equipo === undefined)
    return <EstadoError className="p-10">Ups... {String(error)}</EstadoError>;

  return (
    <main className="mx-auto flex w-full max-w-screen-sm flex-col gap-3.5 px-4 pt-[18px] pb-5">
      <div className="flex items-center gap-3">
        <EscudoEquipo nombre={equipo.nombre} color={equipo.color} size={52} />
        <PageTitle color="primary" className="truncate">
          {equipo.nombre}
        </PageTitle>
      </div>
      <ul className="flex flex-col gap-2.5">
        {equipo.jugadores.map((jugador, index) => {
          if (jugador.idUsuario === null)
            return (
              <li
                key={jugador.nombre + index}
                className="flex min-h-13 items-center justify-between gap-2.5 rounded-input border border-dashed border-input bg-card px-3.5 text-foreground-soft"
              >
                <span className="font-semibold">{jugador.nombre}</span>
                <span className="text-xs font-semibold text-destructive">(No registrado)</span>
              </li>
            );
          return (
            <li key={jugador.idUsuario + index}>
              <Link
                to={"/user/" + jugador.idUsuario}
                className="flex min-h-13 items-center gap-2.5 rounded-input border border-border bg-card px-3.5 text-foreground transition-colors hover:border-input focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <User size={18} className="text-muted-foreground" aria-hidden="true" />
                <span className="font-semibold">{jugador.nombre}</span>
                {user?.id === jugador.idUsuario && (
                  <span className="text-xs font-bold text-primary-text">(Tú)</span>
                )}
                <ChevronRight size={18} className="ml-auto text-muted-foreground" aria-hidden="true" />
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
};
