import type { Equipo } from "../../interfaces/Equipo";

export const Equipos:Equipo[] = [
    {
        id: "1",
        nombre: "FullStack",
        jugadores: [
            {
                nombre: "Ferchy",
                idUsuario: "1",
            },
            {
                nombre: "Velas",
                idUsuario: "2",
            },
        ],
    },
    {
        id: "2",
        nombre: "Makineros",
        jugadores: [
            {
                nombre: "Ruper",
                idUsuario: "3",
            },
            {
                nombre: "Chechu",
                idUsuario: "4",
            },
        ],
    },
    {
        id: "3",
        nombre: "Kakatumba",
        jugadores: [
            {
                nombre: "Aroa",
                idUsuario: "5",
            },
            {
                nombre: "Julián",
                idUsuario: "6",
            },
        ],
    }
]