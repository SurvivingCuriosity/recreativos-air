export const EstadoJugadorEnEquipo = {
  RECHAZADO: 'RECHAZADO',
  ACEPTADO: 'ACEPTADO',
  PENDIENTE: 'PENDIENTE',
} as const;

export type EstadoJugadorEnEquipo = typeof EstadoJugadorEnEquipo[keyof typeof EstadoJugadorEnEquipo];