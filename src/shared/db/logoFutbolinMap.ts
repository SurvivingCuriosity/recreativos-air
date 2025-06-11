import fondoInfinity from "../assets/logos/infinity.png";
import fondoTsunami from "../assets/logos/tsunami.png";
import { TipoFutbolin } from "../enum/TipoFutbolin";

export const logoFutbolinMap: Record<TipoFutbolin, string> = {
  [TipoFutbolin.Infinity]: fondoInfinity,
  [TipoFutbolin.Tsunami]: fondoTsunami,
};
