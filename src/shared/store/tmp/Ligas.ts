import { EstadoLiga } from "../../enum/EstadoLiga";
import { TipoFutbolin } from "../../enum/TipoFutbolin";
import type { Liga } from "../../interfaces/Liga";
import { Equipos } from "./Equipos";
import { generarEnfrentamientos } from "./generarEnfrentamientos";

export const ligas: Liga[] = [
  {
    id: "1",
    nombre: "1ª División Infinity",
    descripcion:
      "La mejor liga de Salamanca vuelve a la acción! 20€ inscripción, premio ir al país de nunca jamás a la final interplanetaria de futbolín",
    tipoFutbolin: TipoFutbolin.Infinity,
    estadoLiga: EstadoLiga.EnCurso,
    ubicaciones: ["La pinta y la loca", "Retiro del campus"],
    equipos: [Equipos[0], Equipos[1], Equipos[2]],
    normas: "Modalidad parado. Se permite violencia en el tercer partido.",
    premio:
      "30€ primer clasificado. 20€ segundo clasificado. 10€ tercer clasificado.",
    enfrentamientos: generarEnfrentamientos(
      [Equipos[0], Equipos[1], Equipos[2]],
      true,
      5
    ),
  },
  {
    id: "2",
    nombre: "1ª División Tsunami",
    descripcion:
      "La mejor liga de Salamanca vuelve a la acción! 20€ inscripción, premio ir al país de nunca jamás a la final interplanetaria de futbolín",
    tipoFutbolin: TipoFutbolin.Tsunami,
    estadoLiga: EstadoLiga.SinEmpezar,
    ubicaciones: ["La pinta y la loca", "Retiro del campus"],
    equipos: Equipos,
    normas: "",
    premio: "",
    enfrentamientos: generarEnfrentamientos(Equipos, false, 4),
  },
];
