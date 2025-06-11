import type { EstadoLiga } from "../enum/EstadoLiga";
import type { TipoFutbolin } from "../enum/TipoFutbolin";
import type { Equipo } from "./Equipo";

export interface Liga {
    id: string;
    nombre: string;
    descripcion: string;
    tipoFutbolin: TipoFutbolin;
    estadoLiga: EstadoLiga;
    equipos: Equipo[]
    premio: string;
    normas: string;
    ubicaciones: string[];
}