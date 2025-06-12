import type { EstadoEnfrentamiento } from "../enum/EstadoEnfrentamiento";
import type { Equipo } from "./Equipo";
import type { Partido } from "./Partido";

export interface Enfrentamiento {
    id: number
    equipoA: Equipo;
    equipoB: Equipo;
    partidos: Partido[]
    fecha: Date|null;
    estado: EstadoEnfrentamiento;
    ubicacion: string;
}