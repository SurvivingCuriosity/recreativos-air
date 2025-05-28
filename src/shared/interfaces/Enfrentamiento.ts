import type { Partido } from "./Partido";

export interface Enfrentamiento {
    id: number
    equipoA: string;
    equipoB: string;
    partidos: Partido[]
    fecha: Date;
}