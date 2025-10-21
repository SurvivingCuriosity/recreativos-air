import logoInfinity from "../assets/logos/infinity.png";
import logoTsunami from "../assets/logos/tsunami.png";
import logoInfinityLight from "../assets/logos/infinitylight.png";
import logoTsunamiLight from "../assets/logos/tsunamilight.png";
import { TipoFutbolin } from "recreativos-air-core/liga";

export const logoFutbolinMap: Record<TipoFutbolin, string> = {
  [TipoFutbolin.Infinity]: logoInfinity,
  [TipoFutbolin.Tsunami]: logoTsunami,
};

export const logoFutbolinMapLight: Record<TipoFutbolin, string> = {
  [TipoFutbolin.Infinity]: logoInfinityLight,
  [TipoFutbolin.Tsunami]: logoTsunamiLight,
};