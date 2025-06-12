import fondoInfinity from "../assets/futbolines/infinity.jpg";
import fondoTsunami from "../assets/futbolines/tsunami.jpg";
import fondoInfinityLight from "../assets/futbolines/infinitylight.jpg";
import fondoTsunamiLight from "../assets/futbolines/tsunamilight.jpg";
import { TipoFutbolin } from "../enum/TipoFutbolin";

export const fondoFutbolinMap: Record<TipoFutbolin, string> = {
  [TipoFutbolin.Infinity]: fondoInfinity,
  [TipoFutbolin.Tsunami]: fondoTsunami,
};


export const fondoFutbolinMapLight: Record<TipoFutbolin, string> = {
  [TipoFutbolin.Infinity]: fondoInfinityLight,
  [TipoFutbolin.Tsunami]: fondoTsunamiLight,
};
