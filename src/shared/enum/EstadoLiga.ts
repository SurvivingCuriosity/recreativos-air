export const EstadoLiga = {
  EnCurso: 'En curso',
  SinEmpezar: 'Sin empezar',
} as const;

export type EstadoLiga = typeof EstadoLiga[keyof typeof EstadoLiga];