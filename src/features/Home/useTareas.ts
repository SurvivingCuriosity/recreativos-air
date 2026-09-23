import { useQueries } from "@tanstack/react-query";
import {
  EstadoEnfrentamiento,
  type EnfrentamientoDTO,
} from "recreativos-air-core/enfrentamiento";
import { EstadoJugadorEnEquipo, type EquipoDTO } from "recreativos-air-core/equipos";
import {
  EstadoEquipoEnLiga,
  EstadoLiga,
  type EquipoEnLigaDTO,
  type LigaDTO,
} from "recreativos-air-core/liga";
import { useAuth } from "../../shared/api/auth/useAuth";
import { EnfrentamientosAPI } from "../../shared/api/enfrentamientos/api";
import { useEnfrentamientosPendientesAdmin } from "../../shared/api/enfrentamientos/hooks";
import { useGetEquiposUsuario } from "../../shared/api/equipos/hooks/useGetEquipos";
import { getEstadoEnfrentamientoInfo } from "../../shared/components/TarjetaEnfrentamiento/estadoEnfrentamiento";
import { useLigasUsuarioHome } from "./useLigasUsuarioHome";

export type Tarea =
  | { tipo: "invitacion"; id: string; equipo: EquipoDTO }
  | { tipo: "resultado"; id: string; enfrentamiento: EnfrentamientoDTO; liga?: LigaDTO }
  | { tipo: "admin-resultado"; id: string; enfrentamiento: EnfrentamientoDTO; liga?: LigaDTO }
  | { tipo: "admin-inscripcion"; id: string; liga: LigaDTO; equipoLiga: EquipoEnLigaDTO };

/** Marcador «10–7 · 8–10 · …» (guion corto, tabular en la UI). */
export const formatMarcador = (enf: EnfrentamientoDTO) =>
  enf.partidos.map((p) => `${p.golesA}–${p.golesB}`).join(" · ");

const porFecha = (a: EnfrentamientoDTO, b: EnfrentamientoDTO) => {
  const ta = a.fecha ? new Date(a.fecha).getTime() : Number.MAX_SAFE_INTEGER;
  const tb = b.fecha ? new Date(b.fecha).getTime() : Number.MAX_SAFE_INTEGER;
  return ta - tb;
};

/**
 * Tareas de la Home (v3). Todo se deriva en cliente:
 * - invitaciones: mis equipos (query «equipos» ya usada en Mi perfil)
 * - resultados por aceptar: enfrentamientos de mis ligas activas (misma query
 *   «enfrentamientosliga» que usan la hero y las tarjetas; lo normal es una liga)
 * - admin: pendientes de confirmar (endpoint propio) e inscripciones pendientes
 *   (derivadas de la lista de ligas ya cargada)
 */
export const useTareas = () => {
  const { user } = useAuth();
  const esAdmin = !!user?.admin;
  const { ligas, activas, isLoading: cargandoLigas } = useLigasUsuarioHome();
  const { data: equipos, isLoading: cargandoEquipos } = useGetEquiposUsuario(user?.id || "");

  const enfQueries = useQueries({
    queries: activas.map((liga) => ({
      queryKey: ["enfrentamientosliga", liga.id],
      queryFn: () => EnfrentamientosAPI.getPorLiga(liga.id),
      enabled: !!liga.id,
    })),
  });
  const cargandoEnf = enfQueries.some((q) => q.isLoading);

  const { data: pendientesAdmin, isLoading: cargandoAdmin } = useEnfrentamientosPendientesAdmin();

  // --- Usuario ---
  const resultados: Tarea[] = enfQueries
    .flatMap((q, i) => {
      const liga = activas[i];
      return ((q.data ?? []) as EnfrentamientoDTO[])
        .filter(
          (e) =>
            e.estado === EstadoEnfrentamiento.CorroborarResultado &&
            getEstadoEnfrentamientoInfo(e, user?.id).debeResponder
        )
        .map((e) => ({ enfrentamiento: e, liga }));
    })
    .sort((a, b) => porFecha(a.enfrentamiento, b.enfrentamiento))
    .map(({ enfrentamiento, liga }) => ({
      tipo: "resultado" as const,
      id: `res-${enfrentamiento.id}`,
      enfrentamiento,
      liga,
    }));

  const invitaciones: Tarea[] = (equipos ?? [])
    .filter(
      (eq) =>
        eq.idCreador !== user?.id &&
        eq.jugadores.some(
          (j) => j.idUsuario === user?.id && j.estado === EstadoJugadorEnEquipo.PENDIENTE
        )
    )
    .map((eq) => ({ tipo: "invitacion" as const, id: `inv-${eq.id}`, equipo: eq }));

  // --- Admin ---
  const adminResultados: Tarea[] = esAdmin
    ? [...(pendientesAdmin ?? [])].sort(porFecha).map((e) => ({
        tipo: "admin-resultado" as const,
        id: `adm-res-${e.id}`,
        enfrentamiento: e,
        liga: ligas?.find((l) => l.id === e.idLiga),
      }))
    : [];

  const adminInscripciones: Tarea[] = esAdmin
    ? (ligas ?? [])
        .filter((l) => l.estadoLiga !== EstadoLiga.Finalizada)
        .flatMap((liga) =>
          liga.equipos
            .filter((el) => el.estado === EstadoEquipoEnLiga.Pendiente && el.equipo)
            .map((equipoLiga) => ({
              tipo: "admin-inscripcion" as const,
              id: `adm-ins-${liga.id}-${equipoLiga.equipo.id}`,
              liga,
              equipoLiga,
            }))
        )
    : [];

  return {
    usuario: [...resultados, ...invitaciones],
    adminResultados,
    adminInscripciones,
    total: resultados.length + invitaciones.length + adminResultados.length + adminInscripciones.length,
    isLoading: cargandoLigas || cargandoEquipos || cargandoEnf || (esAdmin && cargandoAdmin),
  };
};
