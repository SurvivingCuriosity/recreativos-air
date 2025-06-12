import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { Equipo } from "../../interfaces/Equipo";
import type { Liga } from "../../interfaces/Liga";
import { ligas } from "../tmp/Ligas";

interface LigasState {
  ligas: Liga[];
}

const initialState: LigasState = {
  ligas: ligas,
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

export const { crearLiga, eliminarLiga, agregarEquipoALiga } =
  ligasSlice.actions;

export const ligasReducer = ligasSlice.reducer;
