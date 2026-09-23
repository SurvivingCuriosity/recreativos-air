import { EstadoLiga, type LigaDTO } from "recreativos-air-core/liga";
import { useAuth } from "../../shared/api/auth/useAuth";
import { useLigas } from "../../shared/api/ligas/useLigas";
import { useTemporadaActual } from "../../shared/api/temporadas/useTemporadas";

/** Liga activa: no finalizada y de la temporada actual o sin temporada. */
export const esLigaActiva = (l: LigaDTO, temporadaActualId?: string) =>
  l.estadoLiga !== EstadoLiga.Finalizada &&
  (!temporadaActualId || !l.temporada || l.temporada === temporadaActualId);

/** Ligas del usuario clasificadas para la Home (una sola query de ligas). */
export const useLigasUsuarioHome = () => {
  const { user } = useAuth();
  const { data: ligas, isLoading, error } = useLigas();
  const { data: temporadaActual, isLoading: cargandoTemporada } = useTemporadaActual();

  const mias =
    ligas?.filter((l) =>
      l.equipos.some((e) => e.equipo?.jugadores?.some((j) => j.idUsuario === user?.id))
    ) ?? [];

  const activas = mias.filter((l) => esLigaActiva(l, temporadaActual?.id));
  const pasadas = mias.filter((l) => l.estadoLiga === EstadoLiga.Finalizada);

  const abiertas =
    ligas?.filter(
      (l) =>
        l.estadoLiga === EstadoLiga.SinEmpezar &&
        esLigaActiva(l, temporadaActual?.id) &&
        !mias.some((m) => m.id === l.id)
    ).length ?? 0;

  return {
    ligas,
    mias,
    activas,
    pasadas,
    ligasAbiertas: abiertas,
    temporadaActual,
    isLoading: isLoading || cargandoTemporada,
    error,
  };
};
