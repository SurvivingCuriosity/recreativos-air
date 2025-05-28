import type { TipoFutbolin } from "../enum/TipoFutbolin";
import type { Equipo } from "./Equipo";

export interface Liga {
    id: string;
    nombre: string;
    descripcion: string;
    tipoFutbolin: TipoFutbolin;
    equipos: Equipo[]
}