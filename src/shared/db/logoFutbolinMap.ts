import logoInfinity from "../assets/logos/infinity.png";
import logoTsunami from "../assets/logos/tsunami.png";
import { TipoFutbolin } from "recreativos-air-core/liga";

export const logoFutbolinMap: Record<TipoFutbolin, string> = {
  [TipoFutbolin.Infinity]: logoInfinity,
  [TipoFutbolin.Tsunami]: logoTsunami,
};