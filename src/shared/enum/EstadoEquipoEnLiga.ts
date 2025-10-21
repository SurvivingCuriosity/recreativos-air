export const EstadoEquipoEnLiga = {
  Pendiente: "PENDIENTE",
  Aprobado: "APROBADO",
  Rechazado: "RECHAZADO",
} as const;

export type EstadoEquipoEnLiga =
  (typeof EstadoEquipoEnLiga)[keyof typeof EstadoEquipoEnLiga];
