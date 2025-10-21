export const TipoFutbolin = {
  Tsunami: 'TSUNAMI',
  Infinity: 'INFINITY',
} as const;

export type TipoFutbolin = typeof TipoFutbolin[keyof typeof TipoFutbolin];