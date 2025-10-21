export const EstadoEnfrentamiento = {
  SinJugar: "SIN_JUGAR",
  CorroborarResultado: "CORROBORAR_RESULTADO",
  ConfirmarResultado: "CONFIRMAR_RESULTADO",
  Jugado: "JUGADO",
} as const;

export type EstadoEnfrentamiento =
  (typeof EstadoEnfrentamiento)[keyof typeof EstadoEnfrentamiento];

export const EstadoEnfrentamientoOpcionCualquiera = {
  SinJugar: "SIN_JUGAR",
  Jugado: "JUGADO",
  ConfirmarResultado: "CONFIRMAR_RESULTADO",
  Cualquiera: "CUALQUIERA",
} as const;

export type EstadoEnfrentamientoOpcionCualquiera =
  (typeof EstadoEnfrentamientoOpcionCualquiera)[keyof typeof EstadoEnfrentamientoOpcionCualquiera];

