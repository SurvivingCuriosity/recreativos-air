import {
  EstadoEnfrentamiento,
  type EnfrentamientoDTO,
} from "recreativos-air-core/enfrentamiento";
import type { ChipColor } from "../ChipEstado/ChipEstado";

export interface EstadoEnfrentamientoInfo {
  label: string;
  color: ChipColor;
  /** El usuario puede aceptar/rechazar el resultado propuesto. */
  debeResponder: boolean;
}

/** Ids de los equipos del enfrentamiento en los que juega el usuario. */
export const equiposDelUsuarioEnEnfrentamiento = (
  enf: EnfrentamientoDTO,
  userId?: string
): string[] => {
  if (!userId) return [];
  return [enf.equipoA, enf.equipoB]
    .filter((e) => e.jugadores?.some((j) => j.idUsuario === userId))
    .map((e) => e.id);
};

/**
 * Vocabulario único de estado (DESIGN.md §6.4):
 *  SinJugar            → «No jugado»
 *  CorroborarResultado → «Te toca aceptar» (si mi equipo debe responder) / «Esperando al rival»
 *  ConfirmarResultado  → «Esperando al admin»
 *  Jugado              → «Jugado»
 */
export const getEstadoEnfrentamientoInfo = (
  enf: EnfrentamientoDTO,
  userId?: string
): EstadoEnfrentamientoInfo => {
  switch (enf.estado) {
    case EstadoEnfrentamiento.SinJugar:
      return { label: "No jugado", color: "destructive", debeResponder: false };
    case EstadoEnfrentamiento.Jugado:
      return { label: "Jugado", color: "success", debeResponder: false };
    case EstadoEnfrentamiento.ConfirmarResultado:
      return { label: "Esperando al admin", color: "neon", debeResponder: false };
    case EstadoEnfrentamiento.CorroborarResultado: {
      const mios = equiposDelUsuarioEnEnfrentamiento(enf, userId);
      const debeResponder =
        mios.length > 0 &&
        enf.resultadoPropuestoPor !== null &&
        !mios.includes(enf.resultadoPropuestoPor);
      return debeResponder
        ? { label: "Te toca aceptar", color: "primary", debeResponder: true }
        : { label: "Esperando al rival", color: "warning", debeResponder: false };
    }
  }
};
