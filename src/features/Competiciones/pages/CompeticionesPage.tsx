import { Info, Trophy } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "../../../packages/components/Button/Button";
import { useAuth } from "../../../shared/api/auth/useAuth";
import { useGetEquiposUsuario } from "../../../shared/api/equipos/hooks/useGetEquipos";
import { useLigas } from "../../../shared/api/ligas/useLigas";
import {
  useTemporadaActual,
  useTemporadas,
} from "../../../shared/api/temporadas/useTemporadas";
import {
  EstadoError,
  EstadoVacio,
  SkeletonTarjetaLiga,
} from "../../../shared/components/Estados/Estados";
import {
  OPCION_TODAS,
  SelectorTemporada,
} from "../../../shared/components/SelectorTemporada/SelectorTemporada";
import { TarjetaLiga } from "../../../shared/components/TarjetaLiga/TarjetaLiga";
import { PageTitle } from "../../../shared/components/Titulos/Titulos";

export const CompeticionesPage = () => {
  const navigate = useNavigate();

  const { data: temporadas } = useTemporadas();
  const { data: temporadaActual, isLoading: cargandoActual } =
    useTemporadaActual();
  const [temporadaSeleccionada, setTemporadaSeleccionada] = useState<
    string | null
  >(null);
  const temporadaFiltro =
    temporadaSeleccionada ?? temporadaActual?.id ?? OPCION_TODAS;

  const { data: ligas, isLoading, error } = useLigas(
    temporadaFiltro === OPCION_TODAS ? undefined : { temporada: temporadaFiltro },
    { enabled: !cargandoActual }
  );

  const { user } = useAuth();
  const { data: equiposUsuario } = useGetEquiposUsuario(user?.id || "");

  const cargando = isLoading || cargandoActual;

  return (
    <>
      <title>Competiciones | Recreativos Air</title>
      <main className="mx-auto flex w-full max-w-screen-md flex-col gap-3.5 px-4 pt-[18px] pb-5">
        <PageTitle className="text-[30px]">Competiciones</PageTitle>

        <SelectorTemporada
          temporadas={temporadas ?? []}
          value={temporadaFiltro}
          onSelect={setTemporadaSeleccionada}
          incluirOpcionTodas
          incluirOpcionSinTemporada={!!user?.admin}
        />

        {equiposUsuario?.length === 0 && (
          <div className="flex gap-2.5 rounded-input border border-border bg-card px-3 py-2.5 text-[13px] leading-[1.45] text-foreground-soft">
            <Info size={18} className="mt-px shrink-0 text-muted-foreground" aria-hidden="true" />
            <div className="flex flex-col gap-1">
              <p>
                No perteneces a ningún equipo. Debes crear un equipo para poder
                inscribirte a las competiciones
              </p>
              <Link
                to="/crear-equipo"
                className="inline-flex min-h-6 w-fit items-center font-bold text-primary-text underline underline-offset-2"
              >
                Crear equipo
              </Link>
            </div>
          </div>
        )}

        {user?.admin && (
          <Button onClick={() => navigate("/crear-liga")} icon={Trophy}>
            Nueva liga
          </Button>
        )}

        {cargando ? (
          <div className="flex flex-col gap-3.5">
            <SkeletonTarjetaLiga />
            <SkeletonTarjetaLiga />
          </div>
        ) : error ? (
          <EstadoError>Error al cargar {String(error)}</EstadoError>
        ) : ligas?.length === 0 ? (
          <EstadoVacio className="border-0 bg-transparent py-10">No hay ligas</EstadoVacio>
        ) : (
          <ul className="flex w-full flex-col gap-3.5">
            {ligas?.map((liga, index) => (
              <li
                key={liga.id}
                style={{ animationDelay: `${index * 0.1}s` }}
                className="w-full animate-fade-in-top"
              >
                <TarjetaLiga
                  liga={liga}
                  onClick={() => navigate(`/competiciones/${liga.id}/clasificacion`)}
                />
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
};
