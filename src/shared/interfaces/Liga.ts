import type { TipoFutbolin } from "../enum/TipoFutbolin";

export interface Liga {
    id: string;
    nombre: string;
    descripcion: string;
    tipoFutbolin: TipoFutbolin;
}