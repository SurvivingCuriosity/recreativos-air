export const EstadoLiga = {
  EnCurso: 'EN_CURSO',
  SinEmpezar: 'SIN_EMPEZAR',
  Finalizada: 'FINALIZADA'
} as const;

export type EstadoLiga = typeof EstadoLiga[keyof typeof EstadoLiga];