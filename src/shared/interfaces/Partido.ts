import type { Equipo } from "./Equipo";

export interface Partido {
    id: number
    equipoA: Equipo;
    equipoB: Equipo;
    golesA: string;
    golesB: string;
    terminado: boolean;
}