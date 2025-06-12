import type { Enfrentamiento } from "../../interfaces/Enfrentamiento";
import { Equipos } from "./Equipos";
import { generarEnfrentamientos } from "./generarEnfrentamientos";

export const Enfrentamientos:Enfrentamiento[] = generarEnfrentamientos(Equipos, true, 4)