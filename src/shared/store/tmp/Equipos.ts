import type { Equipo } from "../../interfaces/Equipo";
import { Users } from "./Users";

export const Equipos:Equipo[] = [
    {
        id: "1",
        nombre: "FullStack",
        jugadores: [
            {
                nombre: Users.find((u) => u.id === "1")?.nombre || 'No encontrado',
                idUsuario: "1",
            },
            {
                nombre: Users.find((u) => u.id === "2")?.nombre || 'No encontrado',
                idUsuario: "2",
            },
        ],
    },
    {
        id: "2",
        nombre: "Makineros",
        jugadores: [
            {
                nombre: Users.find((u) => u.id === "3")?.nombre || 'No encontrado',
                idUsuario: "3",
            },
            {
                nombre: Users.find((u) => u.id === "4")?.nombre || 'No encontrado',
                idUsuario: "4",
            },
        ],
    },
    {
        id: "3",
        nombre: "Kakatumba",
        jugadores: [
            {
                nombre: Users.find((u) => u.id === "5")?.nombre || 'No encontrado',
                idUsuario: "5",
            },
            {
                nombre: Users.find((u) => u.id === "6")?.nombre || 'No encontrado',
                idUsuario: "6",
            },
        ],
    },
        {
        id: "4",
        nombre: "Cocoloco",
        jugadores: [
            {
                nombre: Users.find((u) => u.id === "1")?.nombre || 'No encontrado',
                idUsuario: "1",
            },
            {
                nombre: Users.find((u) => u.id === "6")?.nombre || 'No encontrado',
                idUsuario: "6",
            },
        ],
    },
        {
        id: "5",
        nombre: "Bests",
        jugadores: [
            {
                nombre: Users.find((u) => u.id === "2")?.nombre || 'No encontrado',
                idUsuario: "2",
            },
            {
                nombre: Users.find((u) => u.id === "6")?.nombre || 'No encontrado',
                idUsuario: "5",
            },
        ],
    },
        {
        id: "6",
        nombre: "Los mejores",
        jugadores: [
            {
                nombre: Users.find((u) => u.id === "3")?.nombre || 'No encontrado',
                idUsuario: "3",
            },
            {
                nombre: Users.find((u) => u.id === "6")?.nombre || 'No encontrado',
                idUsuario: "4",
            },
        ],
    }
]