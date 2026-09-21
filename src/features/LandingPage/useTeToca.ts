import { useQueries } from "@tanstack/react-query";
import type { LucideIcon } from "lucide-react";
import { Hand, UserPlus } from "lucide-react";
import {
  EstadoEnfrentamiento,
  type EnfrentamientoDTO,
} from "recreativos-air-core/enfrentamiento";
import { EstadoJugadorEnEquipo } from "recreativos-air-core/equipos";
import { useAuth } from "../../shared/api/auth/useAuth";
import { EnfrentamientosAPI } from "../../shared/api/enfrentamientos/api";
import { useGetEquiposUsuario } from "../../shared/api/equipos/hooks/useGetEquipos";
import { getEstadoEnfrentamientoInfo } from "../../shared/components/TarjetaEnfrentamiento/estadoEnfrentamiento";
import { useLigasDeUsuario } from "../../shared/hooks/useLigasDeUsuario";

export interface ItemTeToca {
  id: string;
  tipo: "resultado" | "invitacion";
  titulo: string;
  descripcion: string;
  href: string;
  icon: LucideIcon;
}

/**
 * Bloque «Te toca» de la Home (DESIGN.md §6.1): solo items accionables.
 * - Resultados que debo aceptar → /jornadas/:id
 * - Invitaciones a equipo → /mi-perfil
 * No incluye partidos sin jugar.
 */
export const useTeToca = () => {
  const { user } = useAuth();
  const { ligas, loadingLigas } = useLigasDeUsuario();
  const { data: equipos, isLoading: loadingEquipos } = useGetEquiposUsuario(user?.id || "");

  const ligasIds = ligas?.map((l) => l.id) ?? [];

  const enfQueries = useQueries({
    queries: ligasIds.map((ligaId) => ({
      queryKey: ["enfrentamientosliga", ligaId],
      queryFn: () => EnfrentamientosAPI.getPorLiga(ligaId),
      enabled: !!ligaId,
    })),
  });

  const loadingEnf = enfQueries.some((q) => q.isLoading);

  const resultados: ItemTeToca[] = enfQueries.flatMap((q, i) => {
    const liga = ligas?.[i];
    const enfrentamientos = (q.data ?? []) as EnfrentamientoDTO[];
    return enfrentamientos
      .filter(
        (e) =>
          e.estado === EstadoEnfrentamiento.CorroborarResultado &&
          getEstadoEnfrentamientoInfo(e, user?.id).debeResponder
      )
      .map((e) => ({
        id: `enf-${e.id}`,
        tipo: "resultado" as const,
        titulo: "Te toca aceptar",
        descripcion: `${e.equipoA.nombre} vs ${e.equipoB.nombre}${liga ? ` · ${liga.nombre}` : ""}`,
        href: `/jornadas/${e.id}`,
        icon: Hand,
      }));
  });

  const invitaciones: ItemTeToca[] = (equipos ?? [])
    .filter(
      (eq) =>
        eq.idCreador !== user?.id &&
        eq.jugadores.some(
          (j) => j.idUsuario === user?.id && j.estado === EstadoJugadorEnEquipo.PENDIENTE
        )
    )
    .map((eq) => ({
      id: `inv-${eq.id}`,
      tipo: "invitacion" as const,
      titulo: "Has sido invitado a este equipo",
      descripcion: eq.nombre,
      href: "/mi-perfil",
      icon: UserPlus,
    }));

  return {
    items: [...resultados, ...invitaciones],
    isLoading: loadingLigas || loadingEquipos || loadingEnf,
  };
};
