import { useQueryClient } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import { useCallback, useRef } from "react";
import { Outlet, useLocation, useParams } from "react-router";
import { EstadoEquipoEnLiga, EstadoLiga } from "recreativos-air-core/liga";
import { Button } from "../../packages/components/Button/Button";
import { useAuth } from "../../shared/api/auth/useAuth";
import { useLigaById } from "../../shared/api/ligas/useLigas";
import { ChipEstado } from "../../shared/components/ChipEstado/ChipEstado";
import { EstadoVacio, SkeletonLista } from "../../shared/components/Estados/Estados";
import { ChipEstadoLiga } from "../../shared/components/TarjetaLiga/ChipEstadoLiga";
import { SectionTitle } from "../../shared/components/Titulos/Titulos";
import { logoFutbolinMap } from "../../shared/db/logoFutbolinMap";
import { useInscribirmeEnLiga } from "../../shared/hooks/useInscribirmeEnLiga";
import { NavDetalleLiga, TABS_LIGA } from "./NavDetalleLiga";
import { PanelMiEquipo } from "./PanelMiEquipo";

export const DetalleLigaLayout = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { pathname } = useLocation();

  const { data: liga, isLoading, error } = useLigaById(id!);
  const { inscribirme, isPending } = useInscribirmeEnLiga(liga);

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-screen-sm px-4 pt-3.5 lg:max-w-5xl lg:px-6">
        <SkeletonLista count={3} height="h-14" label="Cargando liga..." />
      </main>
    );
  }

  if (error || !liga) {
    return (
      <main className="mx-auto w-full max-w-screen-sm px-4 pt-10">
        <EstadoVacio className="border-0 bg-transparent">
          <span className="mb-2 block font-display text-xl font-bold text-primary-text">
            Liga no encontrada
          </span>
          No se ha podido cargar la información de esta liga.
        </EstadoVacio>
      </main>
    );
  }

  const equipoUsuario = liga.equipos?.find((e) =>
    e.equipo.jugadores?.some((j) => j.idUsuario === user?.id)
  );
  const userYaInscrito = !!equipoUsuario;

  const segmentoActivo = pathname.split("/").filter(Boolean).pop();
  const tabActiva = TABS_LIGA.find((t) => t.segment === segmentoActivo);

  return (
    <main className="mx-auto flex w-full max-w-screen-sm flex-col gap-3.5 px-4 pt-3.5 pb-5 lg:max-w-5xl lg:gap-6 lg:px-6 lg:pt-8">
      <div className="flex animate-fade-in-top items-center gap-2.5">
        <img
          src={logoFutbolinMap[liga.tipoFutbolin]}
          alt={liga.tipoFutbolin}
          className="size-9 shrink-0 object-contain lg:size-11"
        />
        <h1 className="min-w-0 truncate font-display text-2xl leading-[1.1] font-bold text-primary-text text-glow-liga lg:text-[32px]">
          {liga.nombre}
        </h1>
        <ChipEstadoLiga estado={liga.estadoLiga} className="ml-auto shrink-0" />
      </div>

      {userYaInscrito
        ? equipoUsuario?.estado === EstadoEquipoEnLiga.Pendiente && (
            <div className="flex">
              <ChipEstado color="warning">Esperando confirmación...</ChipEstado>
            </div>
          )
        : liga.estadoLiga === EstadoLiga.SinEmpezar && (
            <div className="flex justify-center">
              <Button onClick={inscribirme} disabled={isPending} className="lg:w-auto">
                Inscribirme
              </Button>
            </div>
          )}

      <NavDetalleLiga />

      <div className="grid gap-3.5 lg:grid-cols-[2fr_1fr] lg:items-start lg:gap-6">
        <div className="flex min-w-0 flex-col gap-3.5">
          {tabActiva && (
            <SectionTitle className="animate-fade-in-top" >{tabActiva.titulo}</SectionTitle>
          )}
          <Outlet />
        </div>
        {equipoUsuario?.equipo && (
          <PanelMiEquipo liga={liga} equipo={equipoUsuario.equipo} />
        )}
      </div>
    </main>
  );
};

export function BotonRefrescar({ onClick }: { onClick?: () => void }) {
  const qc = useQueryClient();
  const isDebouncing = useRef(false);

  const handleClick = useCallback(() => {
    onClick?.();
    if (isDebouncing.current) return; // evita spam

    isDebouncing.current = true;
    qc.invalidateQueries();

    // Permite nuevo click después de 2 segundos
    setTimeout(() => {
      isDebouncing.current = false;
    }, 2000);
  }, [qc, onClick]);

  return (
    <Button onClick={handleClick} variant="outline-neutral" icon={RefreshCw}>
      Actualizar
    </Button>
  );
}
