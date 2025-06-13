import { Equipos } from "./../tmp/Equipos";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Equipo } from "../../interfaces/Equipo";

export interface UserState {
  equiposUsuario: Equipo[];
}

const initialState: UserState = {
  equiposUsuario: Equipos.filter((e) => e.jugadores.some((j) => j.idUsuario === "1")),
};

const userSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    agregarEquipo(state, action: PayloadAction<Equipo>) {
      state.equiposUsuario.push(action.payload);
    },
  },
});

export const { agregarEquipo } = userSlice.actions;

export default userSlice.reducer;
