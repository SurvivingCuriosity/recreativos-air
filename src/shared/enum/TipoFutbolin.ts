export const TipoFutbolin = {
  Tsunami: 'Tsunami',
  Infinity: 'Infinity',
} as const;

export type TipoFutbolin = typeof TipoFutbolin[keyof typeof TipoFutbolin];