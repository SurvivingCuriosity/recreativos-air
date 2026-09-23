import { EstadoEquipoEnLiga, EstadoLiga } from "recreativos-air-core/liga";
import { useEnfrentamientosPendientesAdmin } from "../api/enfrentamientos/hooks";
import { useLigas } from "../api/ligas/useLigas";

/** Badge de la navegación del admin: resultados por confirmar + inscripciones pendientes. */
export const useConteoTareasAdmin = () => {
  const { data: pendientes } = useEnfrentamientosPendientesAdmin();
  const { data: ligas } = useLigas();

  const inscripciones =
    ligas
      ?.filter((l) => l.estadoLiga !== EstadoLiga.Finalizada)
      .reduce(
        (acc, l) => acc + l.equipos.filter((e) => e.estado === EstadoEquipoEnLiga.Pendiente).length,
        0
      ) ?? 0;

  return (pendientes?.length ?? 0) + inscripciones;
};
