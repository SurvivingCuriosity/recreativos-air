import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "../../shared/api/auth/useAuth";
import { useGetEquiposUsuario } from "../../shared/api/equipos/hooks/useGetEquipos";
import { EstadoError } from "../../shared/components/Estados/Estados";
import { ContadorSeccion, SectionTitle } from "../../shared/components/Titulos/Titulos";
import { FooterFutbolin } from "../LandingPage/FooterFutbolin";
import { CaminoALaLiga } from "./CaminoALaLiga";
import { EnlaceLigasAnteriores } from "./LigasAnteriores";
import { ListaTareas, SubtituloGrupo, TareaItem } from "./Tareas";
import { TarjetaLigaHero } from "./TarjetaLigaHero";
import { useLigasUsuarioHome } from "./useLigasUsuarioHome";
import { useTareas } from "./useTareas";

const plural = (n: number, s: string, p: string) => (n === 1 ? s : p);

/** Saludo «Hola, {nombre}» con el resumen de tareas debajo. */
export const Saludo = ({
  nombre,
  tareas,
  admin,
}: {
  nombre: string;
  tareas: number;
  admin: boolean;
}) => (
  <div className="flex flex-col gap-1">
    <h1 className="font-display text-[30px] leading-[1.1] font-bold normal-case tracking-normal text-foreground">
      Hola, <span className="text-primary-text text-glow-liga">{nombre}</span>
    </h1>
    {tareas > 0 ? (
      <p className="text-sm text-foreground-soft">
        {admin
          ? `Tienes ${tareas} ${plural(tareas, "tarea", "tareas")} de administración`
          : `Tienes ${tareas} ${plural(tareas, "tarea pendiente", "tareas pendientes")}`}
      </p>
    ) : (
      <p className="text-xs text-muted-foreground">Sin tareas pendientes</p>
    )}
  </div>
);

const HomeSkeleton = () => (
  <div role="status" aria-label="Cargando" className="flex flex-col gap-[22px]">
    <div className="flex flex-col gap-2">
      <Skeleton className="h-8 w-52 rounded-input bg-muted" />
      <Skeleton className="h-4 w-40 rounded-input bg-muted" />
    </div>
    <Skeleton className="h-32 w-full rounded-[18px] bg-muted" />
    <Skeleton className="h-60 w-full rounded-[24px] bg-muted" />
    <span className="sr-only">Cargando...</span>
  </div>
);

const anim = (i: number) => ({ style: { animationDelay: `${i * 0.08}s` } });

/** Home con sesión (design/home-v3). */
export const HomePage = () => {
  const { user } = useAuth();
  const esAdmin = !!user?.admin;
  const { activas, pasadas, ligasAbiertas, temporadaActual, isLoading, error } = useLigasUsuarioHome();
  const { data: equipos, isLoading: cargandoEquipos } = useGetEquiposUsuario(user?.id || "");
  const tareas = useTareas();
  const [ocultas, setOcultas] = useState<Set<string>>(() => new Set());

  const ocultar = (id: string) => setOcultas((prev) => new Set(prev).add(id));
  const visible = <T extends { id: string }>(xs: T[]) => xs.filter((t) => !ocultas.has(t.id));

  if (isLoading || cargandoEquipos || tareas.isLoading) return <HomeSkeleton />;

  const usuario = visible(tareas.usuario);
  const adminRes = visible(tareas.adminResultados);
  const adminIns = visible(tareas.adminInscripciones);
  const totalTareas = usuario.length + adminRes.length + adminIns.length;
  const hayAdmin = adminRes.length + adminIns.length > 0;

  const tieneLigaActiva = activas.length > 0;
  const tieneEquipo = (equipos?.length ?? 0) > 0;
  let i = 0;

  return (
    <div className="flex flex-1 flex-col gap-[22px]">
      <div className="animate-fade-in-top" {...anim(i++)}>
        <Saludo
          nombre={user?.nombre?.trim() || user?.username || ""}
          tareas={totalTareas}
          admin={esAdmin && hayAdmin}
        />
      </div>

      {totalTareas > 0 && (
        <section className="flex animate-fade-in-top flex-col gap-2.5" {...anim(i++)}>
          <SectionTitle
            right={<ContadorSeccion value={totalTareas} color={hayAdmin ? "destructive" : "primary"} />}
          >
            Tus tareas
          </SectionTitle>
          <ListaTareas>
            {usuario.map((t) => (
              <TareaItem key={t.id} tarea={t} onResuelta={ocultar} />
            ))}
            {adminRes.length > 0 && (
              <>
                <SubtituloGrupo count={adminRes.length}>Resultados por confirmar</SubtituloGrupo>
                {adminRes.map((t) => (
                  <TareaItem key={t.id} tarea={t} onResuelta={ocultar} />
                ))}
              </>
            )}
            {adminIns.length > 0 && (
              <>
                <SubtituloGrupo count={adminIns.length}>Inscripciones · No aceptado</SubtituloGrupo>
                {adminIns.map((t) => (
                  <TareaItem key={t.id} tarea={t} onResuelta={ocultar} />
                ))}
              </>
            )}
          </ListaTareas>
        </section>
      )}

      {error ? (
        <EstadoError>Error al cargar las ligas: {error.message}</EstadoError>
      ) : (
        <>
          {!tieneLigaActiva && (
            <div className="animate-fade-in-top" {...anim(i++)}>
              <CaminoALaLiga
                tieneEquipo={tieneEquipo}
                tieneLigasPasadas={pasadas.length > 0}
                ligasAbiertas={ligasAbiertas}
                temporada={temporadaActual?.nombre}
                storageKey={`home-camino-cerrado:${user?.id ?? ""}`}
              />
            </div>
          )}

          {tieneLigaActiva && (
            <section className="flex animate-fade-in-top flex-col gap-2.5" {...anim(i++)}>
              <SectionTitle>Tu liga</SectionTitle>
              {activas.map((liga) => (
                <TarjetaLigaHero
                  key={liga.id}
                  liga={liga}
                  equipo={
                    liga.equipos.find((e) =>
                      e.equipo?.jugadores?.some((j) => j.idUsuario === user?.id)
                    )?.equipo
                  }
                />
              ))}
            </section>
          )}

          {!tieneLigaActiva && pasadas.length > 0 && (
            <div className="flex animate-fade-in-top" {...anim(i++)}>
              <EnlaceLigasAnteriores />
            </div>
          )}
        </>
      )}

      <FooterFutbolin />
    </div>
  );
};
