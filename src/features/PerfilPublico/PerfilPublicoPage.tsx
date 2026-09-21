import { Mail, Phone } from "lucide-react";
import { Link, Navigate, useNavigate, useParams } from "react-router";
import { cn } from "@/lib/utils";
import { useAuth } from "../../shared/api/auth/useAuth";
import { useGetEquiposUsuario } from "../../shared/api/equipos/hooks/useGetEquipos";
import { useLigas } from "../../shared/api/ligas/useLigas";
import { useGetUserById } from "../../shared/api/user/hooks";
import { ChipEstado } from "../../shared/components/ChipEstado/ChipEstado";
import { EstadoVacio, SkeletonLista } from "../../shared/components/Estados/Estados";
import { TarjetaEquipo } from "../../shared/components/TarjetaEquipo/TarjetaEquipo";
import { TarjetaLiga } from "../../shared/components/TarjetaLiga/TarjetaLiga";
import { SectionTitle } from "../../shared/components/Titulos/Titulos";
import { ButtonWhatsapp2 } from "../LandingPage/ButtonWhatsapp";

/** Avatar neutro con la inicial del usuario (design/screens/PerfilPublico.html). */
const AvatarUsuario = ({ nombre }: { nombre?: string }) => (
  <span
    aria-hidden="true"
    className="inline-flex size-13 shrink-0 items-center justify-center rounded-input border border-white/18 font-display text-[19px] font-bold text-white"
    style={{
      background: "linear-gradient(160deg, #525252, rgb(10 10 10 / 0.2)), #525252",
    }}
  >
    {(nombre?.trim()[0] ?? "?").toUpperCase()}
  </span>
);

export const PerfilPublicoPage = () => {
  const { id } = useParams();

  const { user: loggedInUser } = useAuth();
  const isAdmin = loggedInUser?.admin;

  const { data: user, isLoading: cargandoUsuario } = useGetUserById(id || "");

  const { data: equiposUsuario, isLoading: cargandoEquipos } = useGetEquiposUsuario(
    user?.id || ""
  );

  const { data: ligas, isLoading: cargandoLigas } = useLigas();

  const ligasEnLasQueEstaInscrito = ligas?.filter((l) =>
    l.equipos.some((e) =>
      e.equipo.jugadores.some((j) => j.idUsuario === user?.id)
    )
  );

  const navigate = useNavigate();

  if (
    user !== undefined &&
    loggedInUser !== undefined &&
    loggedInUser?.id === user.id
  ) {
    return <Navigate to="/mi-perfil" />;
  }

  const equipos = equiposUsuario ?? [];
  const carruselEquipos = equipos.length > 3;
  const ligasInscrito = ligasEnLasQueEstaInscrito ?? [];
  const carruselLigas = ligasInscrito.length > 3;

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-[22px] px-4 pt-[18px] pb-5 lg:px-6 lg:pt-8">
      {/* Cabecera */}
      <section className="relative flex items-center gap-3.5 rounded-[18px] border border-border bg-card p-3.5">
        {cargandoUsuario ? (
          <SkeletonLista count={1} height="h-13" label="Cargando perfil..." />
        ) : (
          <>
            <AvatarUsuario nombre={user?.username} />
            <div className="flex min-w-0 flex-col gap-[3px]">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="truncate font-display text-[28px] leading-none font-bold tracking-[0.02em] text-primary-text uppercase text-glow-brand">
                  {user?.username}
                </h1>
                {user?.admin && <ChipEstado color="primary">ADMIN</ChipEstado>}
              </div>
              <span className="text-foreground-soft">{user?.nombre}</span>
              {isAdmin && (
                <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Phone size={14} aria-hidden="true" />
                  {user?.movil}
                </span>
              )}
              {isAdmin && (
                <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Mail size={14} aria-hidden="true" />
                  {user?.email}
                </span>
              )}
            </div>
            {isAdmin && user?.movil && (
              <ButtonWhatsapp2 numero={user.movil} className="ml-auto self-start" />
            )}
          </>
        )}
      </section>

      <div className="grid gap-[22px] lg:grid-cols-2 lg:items-start lg:gap-4">
        <section className="flex min-w-0 flex-col gap-2.5">
          <SectionTitle size="sm">Equipos</SectionTitle>
          {cargandoEquipos ? (
            <SkeletonLista count={1} height="h-28" label="Cargando equipos..." />
          ) : equipos.length > 0 ? (
            <ul
              className={cn(
                "flex w-full gap-2.5",
                carruselEquipos ? "-mr-4 snap-x overflow-x-auto pb-2 lg:mr-0" : "flex-col"
              )}
            >
              {equipos.map((equipo) => (
                <li key={equipo.id} className={cn(carruselEquipos && "w-[88%] shrink-0 snap-start")}>
                  <TarjetaEquipo
                    equipo={equipo}
                    onClick={() => navigate(`/equipos/${equipo.id}`)}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <EstadoVacio className="border-0 bg-transparent">No tiene equipos</EstadoVacio>
          )}
        </section>

        <section className="flex min-w-0 flex-col gap-2.5">
          <SectionTitle size="sm">Competiciones</SectionTitle>
          {cargandoLigas ? (
            <SkeletonLista count={1} height="h-[132px]" label="Cargando ligas..." />
          ) : ligasInscrito.length > 0 ? (
            <ul
              className={cn(
                "flex w-full gap-2.5",
                carruselLigas ? "-mr-4 snap-x overflow-x-auto pb-2 lg:mr-0" : "flex-col"
              )}
            >
              {ligasInscrito.map((l) => (
                <li key={l.id} className={cn(carruselLigas && "w-[88%] max-w-96 shrink-0 snap-center")}>
                  <TarjetaLiga
                    liga={l}
                    onClick={() => navigate(`/competiciones/${l.id}/clasificacion`)}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <EstadoVacio
              className="border-0 bg-transparent"
              action={
                <Link
                  to="/competiciones"
                  className="inline-flex min-h-11 items-center text-primary-text underline underline-offset-2"
                >
                  Ver competiciones
                </Link>
              }
            >
              No estas inscrito a ninguna competición
            </EstadoVacio>
          )}
        </section>
      </div>
    </main>
  );
};
