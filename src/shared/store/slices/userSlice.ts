import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Equipo } from "../../interfaces/Equipo";
import type { User } from "../../interfaces/User";

export interface UserState {
  user: User | null;
  equiposUsuario: Equipo[];
}

const initialState: UserState = {
  user: {
    id: "1",
    username: "alberto",
    nombre: "Alberto",
    admin: true,
  },
  equiposUsuario: [],
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
