import fondoInfinity from "../assets/futbolines/infinity.jpg";
import fondoTsunami from "../assets/futbolines/tsunami.jpg";
import { TipoFutbolin } from "../enum/TipoFutbolin";

export const fondoFutbolinMap: Record<TipoFutbolin, string> = {
  [TipoFutbolin.Infinity]: fondoInfinity,
  [TipoFutbolin.Tsunami]: fondoTsunami,
};
