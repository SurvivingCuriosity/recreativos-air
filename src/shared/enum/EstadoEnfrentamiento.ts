export const EstadoEnfrentamiento = {
  SinJugar: 'Sin jugar',
  Jugado: 'Jugado',
  ConfirmarResultado: 'Confirmar resultado',
} as const;

export type EstadoEnfrentamiento = typeof EstadoEnfrentamiento[keyof typeof EstadoEnfrentamiento];

export const EstadoEnfrentamientoOpcionCualquiera = {
  SinJugar: 'Sin jugar',
  Jugado: 'Jugado',
  ConfirmarResultado: 'Confirmar resultado',
  Cualquiera: 'Cualquiera',
} as const;

export type EstadoEnfrentamientoOpcionCualquiera = typeof EstadoEnfrentamientoOpcionCualquiera[keyof typeof EstadoEnfrentamientoOpcionCualquiera];