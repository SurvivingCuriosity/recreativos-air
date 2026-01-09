import fondoInfinity from "../assets/futbolines/infinity.jpg";
import fondoTsunami from "../assets/futbolines/tsunami.jpg";
import { TipoFutbolin } from "recreativos-air-core/liga";

export const fondoFutbolinMap: Record<TipoFutbolin, string> = {
  [TipoFutbolin.Infinity]: fondoInfinity,
  [TipoFutbolin.Tsunami]: fondoTsunami,
};
