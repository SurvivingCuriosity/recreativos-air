import { Link, useNavigate } from "react-router";
import { EstadoLiga, type LigaDTO } from "recreativos-air-core/liga";
import { cn } from "@/lib/utils";
import { Button } from "../../packages/components/Button/Button";
import { useAuth } from "../../shared/api/auth/useAuth";
import { useLigas } from "../../shared/api/ligas/useLigas";
import { useTemporadaActual } from "../../shared/api/temporadas/useTemporadas";
import fondo from "../../shared/assets/tsunami.jpg";
import { authLinkClass } from "../../shared/components/Auth/AuthCard";
import { EstadoError, SkeletonTarjetaLiga } from "../../shared/components/Estados/Estados";
import { TarjetaLiga } from "../../shared/components/TarjetaLiga/TarjetaLiga";
import { SectionTitle } from "../../shared/components/Titulos/Titulos";
import { TELEFONO_ALBERTO } from "../../shared/db/telefono";
import { useLigasDeUsuario } from "../../shared/hooks/useLigasDeUsuario";
import { EnfrentamientosPendientes } from "../Jornadas/DetalleJornada/components/EnfrentamientosPendientes";
import { ButtonWhatsapp } from "./ButtonWhatsapp";
import { CtaLigasDisponibles } from "./CtaLigasDisponibles";
import { TeToca } from "./TeToca";

/** Pie con el enlace a futbolin.app (DESIGN.md §6.2: pie de Home/Landing). */
const FooterFutbolin = ({ className }: { className?: string }) => (
  <a
    href="https://www.futbolin.app"
    target="_blank"
    rel="noreferrer"
    className={cn(
      "relative mt-auto flex w-full flex-col items-center gap-2.5 rounded-liga border border-border bg-card/85 p-4 font-display text-[13px] font-semibold tracking-[0.04em] text-foreground backdrop-blur-xs lg:w-auto lg:flex-row lg:gap-4 lg:px-6",
      className
    )}
  >
    <span>¡ Encuentra futbolines cerca !</span>
    <img src="/logo-futbol-in.png" alt="futbolin.app" className="w-[150px] lg:w-24" />
  </a>
);

export const LandingPage = () => {
  const navigate = useNavigate();

  const { ligas: ligasUsuario, loadingLigas, errorLigas } = useLigasDeUsuario();
  const { data: todasLasLigas } = useLigas();
  const { data: temporadaActual } = useTemporadaActual();
  const { isLoggedIn, isLoading, user } = useAuth();

  // Una liga se considera activa si no ha finalizado y no pertenece a una temporada pasada
  const esLigaActiva = (l: LigaDTO) =>
    l.estadoLiga !== EstadoLiga.Finalizada &&
    (!temporadaActual || !l.temporada || l.temporada === temporadaActual.id);

  const ligas = ligasUsuario
    ? [...ligasUsuario].sort(
        (a, b) => Number(esLigaActiva(b)) - Number(esLigaActiva(a))
      )
    : undefined;

  const sinLigasActivas = !!ligas && !ligas.some(esLigaActiva);

  const ligasDisponibles =
    todasLasLigas?.filter(
      (l) =>
        l.estadoLiga === EstadoLiga.SinEmpezar &&
        esLigaActiva(l) &&
        !ligasUsuario?.some((lu) => lu.id === l.id)
    ).length ?? 0;

  const handleNavigateLiga = (idLiga: string) => {
    navigate(`/competiciones/${idLiga}/clasificacion`);
  };

  const heroInvitado = !isLoading && !isLoggedIn;

  return (
    <main className="relative flex w-full flex-1 flex-col">
      {/* Hero: foto con degradado hacia el fondo (design/screens/Home.html) */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 hidden overflow-hidden dark:block",
          heroInvitado ? "bottom-0" : "h-[300px] lg:h-[260px]"
        )}
      >
        <img
          src={fondo}
          alt=""
          className={cn(
            "h-full w-full object-cover",
            heroInvitado ? "object-[72%_center] opacity-80" : "object-right opacity-55 lg:object-[center_35%] lg:opacity-60"
          )}
        />
        <div
          className={cn(
            "absolute inset-0",
            heroInvitado
              ? "bg-[linear-gradient(180deg,rgb(from_var(--background)_r_g_b/0.55),rgb(from_var(--background)_r_g_b/0.2)_45%,rgb(from_var(--background)_r_g_b/0.85))]"
              : "bg-[linear-gradient(180deg,rgb(from_var(--background)_r_g_b/0.35),var(--background)_92%)]"
          )}
        />
      </div>

      <div
        className={cn(
          "relative flex w-full flex-1 flex-col items-center gap-[22px] px-4 pb-5",
          heroInvitado ? "pt-10" : "pt-7 lg:pt-12"
        )}
      >
        <div className="flex flex-col items-center gap-2.5 text-center">
          <h1 className="animate-fade-in-top font-display text-[38px] leading-none font-bold tracking-[0.01em] text-foreground uppercase lg:text-6xl">
            Recreativos{" "}
            <span className="text-primary-text text-glow-brand dark:[text-shadow:0_0_14px_rgb(235_138_31/0.45)]">
              AIR
            </span>
          </h1>
          <p className="max-w-80 animate-fade-in-top text-sm leading-[1.45] text-balance text-foreground-soft lg:max-w-none lg:text-[15px]">
            Empresa especializada en futbolines Tsunami e Infinity en la provincia
            de Salamanca.
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-1 items-center justify-center" role="status" aria-label="Cargando">
            <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : isLoggedIn ? (
          <div className="grid w-full max-w-3xl gap-6 lg:max-w-none lg:grid-cols-[2fr_3fr] lg:items-start lg:gap-8 lg:px-2">
            <div className="flex flex-col gap-[22px]">
              {user?.admin ? <EnfrentamientosPendientes /> : <TeToca />}
            </div>
            <section className="flex w-full min-w-0 flex-col gap-2.5">
              <SectionTitle>Mis ligas</SectionTitle>
              {loadingLigas ? (
                <SkeletonTarjetaLiga label="Cargando..." />
              ) : errorLigas ? (
                <EstadoError>Error al cargar las ligas: {errorLigas.message}</EstadoError>
              ) : (
                <ul
                  className={cn(
                    "flex snap-x gap-2.5 overflow-x-auto pb-2 lg:grid lg:grid-cols-2 lg:overflow-visible",
                    ligas && ligas.length > 1 && "-mr-4 lg:mr-0"
                  )}
                >
                  {ligas?.map((l) => (
                    <li
                      key={l.id}
                      className={cn(
                        "shrink-0 snap-center lg:w-auto",
                        ligas.length > 1 ? "w-[88%]" : "w-full"
                      )}
                    >
                      <TarjetaLiga liga={l} onClick={() => handleNavigateLiga(l.id)} />
                    </li>
                  ))}
                </ul>
              )}
              {sinLigasActivas && !loadingLigas && (
                <CtaLigasDisponibles
                  ligasDisponibles={ligasDisponibles}
                  tieneLigas={!!ligas?.length}
                  temporadaActual={temporadaActual}
                />
              )}
            </section>
          </div>
        ) : (
          <div className="flex w-full max-w-lg flex-col items-center gap-2">
            <div className="mt-2 flex w-full gap-2">
              <Button as="a" href="/login" onClick={() => navigate("/login")}>
                Entrar 🚀
              </Button>
              <Button
                as="a"
                href="/register"
                variant="outline"
                onClick={() => navigate("/register")}
                className="bg-background/60 dark:bg-background/60"
              >
                No tengo cuenta
              </Button>
            </div>
            <Link to="/reset-password" className={`${authLinkClass} text-foreground`}>
              He olvidado mi contraseña
            </Link>
          </div>
        )}

        <FooterFutbolin className={cn(!heroInvitado && "lg:mt-4")} />

        {heroInvitado && <ButtonWhatsapp numero={TELEFONO_ALBERTO} />}
      </div>
    </main>
  );
};
