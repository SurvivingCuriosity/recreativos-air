import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { TipoFutbolin } from "../../enum/TipoFutbolin";
import type { Liga } from "../../interfaces/Liga";
import type { Equipo } from "../../interfaces/Equipo";

interface LigasState {
  ligas: Liga[];
}

const initialState: LigasState = {
  ligas: [
    {
      id: "1",
      nombre: "1ª División Infinity",
      descripcion:
        "La mejor liga de Salamanca vuelve a la acción! 20€ inscripción, premio ir al país de nunca jamás a la final interplanetaria de futbolín",
      tipoFutbolin: TipoFutbolin.Infinity,
      equipos: [
        {
          id: "1",
          nombre: "Equipo 1",
          jugadores: [
            {
              nombre: "Paco",
              idUsuario: "1",
            },
            {
              nombre: "Pollo",
              idUsuario: "2",
            },
          ],
        },
        {
          id: "2",
          nombre: "Equipo 2",
          jugadores: [
            {
              nombre: "Fer",
              idUsuario: "1",
            },
            {
              nombre: "Ruper",
              idUsuario: "2",
            },
          ],
        },
        {
          id: "3",
          nombre: "Equipo 3",
          jugadores: [
            {
              nombre: "Velas",
              idUsuario: "1",
            },
            {
              nombre: "Aroa",
              idUsuario: "2",
            },
          ],
        },
        {
          id: "4",
          nombre: "Equipo 4",
          jugadores: [
            {
              nombre: "Villa",
              idUsuario: "1",
            },
            {
              nombre: "Torres",
              idUsuario: "2",
            },
          ],
        },
        {
          id: "5",
          nombre: "Equipo 5",
          jugadores: [
            {
              nombre: "Jona",
              idUsuario: "1",
            },
            {
              nombre: "Najo",
              idUsuario: "2",
            },
          ],
        },
        {
          id: "6",
          nombre: "Equipo 6",
          jugadores: [
            {
              nombre: "Ñengo Flow",
              idUsuario: "1",
            },
            {
              nombre: "Anuel",
              idUsuario: "2",
            },
          ],
        },
      ],
    },
    {
      id: "2",
      nombre: "1ª División Tsunami",
      descripcion:
        "La mejor liga de Salamanca vuelve a la acción! 20€ inscripción, premio ir al país de nunca jamás a la final interplanetaria de futbolín",
      tipoFutbolin: TipoFutbolin.Tsunami,
      equipos: [
        {
          id: "1",
          nombre: "Equipo 1",
          jugadores: [
            {
              nombre: "Jugador 1",
              idUsuario: "1",
            },
            {
              nombre: "Jugador 2",
              idUsuario: "2",
            },
          ],
        },
        {
          id: "1",
          nombre: "Equipo 1",
          jugadores: [
            {
              nombre: "Jugador 1",
              idUsuario: "1",
            },
            {
              nombre: "Jugador 2",
              idUsuario: "2",
            },
          ],
        },
      ],
    },
  ],
};

export const ligasSlice = createSlice({
  name: "ligas",
  initialState,
  reducers: {
    agregarEquipoALiga: (
      state,
      action: PayloadAction<{ idLiga: string; equipo: Equipo }>
    ) => {
      const liga = state.ligas.find(
        (liga) => liga.id === action.payload.idLiga
      );
      if (!liga) return;

      liga.equipos.push(action.payload.equipo);
    },
    eliminarLiga: (state, action: PayloadAction<Liga["id"]>) => {
      state.ligas = state.ligas.filter((liga) => liga.id !== action.payload);
    },
    crearLiga: (state, action: PayloadAction<Liga>) => {
      state.ligas.push(action.payload);
    },
  },
});

export const { crearLiga, eliminarLiga, agregarEquipoALiga } = ligasSlice.actions;

export const ligasReducer = ligasSlice.reducer;
