import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import { TipoFutbolin } from '../../enum/TipoFutbolin'
import type { Liga } from '../../interfaces/Liga'

interface LigasState {
  ligas: Liga[]
}

const initialState: LigasState = {
  ligas: [
    {
      id: '1',
      nombre: '1ª División Infinity',
      tipoFutbolin: TipoFutbolin.Infinity
    },
    {
      id: '2',
      nombre: '1ª División Tsunami',
      tipoFutbolin: TipoFutbolin.Tsunami
    }
  ],
}

export const ligasSlice = createSlice({
  name: 'ligas',
  initialState,
  reducers: {
    eliminarLiga: (state, action: PayloadAction<Liga['id']>) => {
      state.ligas = state.ligas.filter(liga => liga.id !== action.payload)
    },
    crearLiga: (state, action: PayloadAction<Liga>) => {
      state.ligas.push(action.payload)
    },
  },
})

export const { crearLiga, eliminarLiga } = ligasSlice.actions

export const ligasReducer = ligasSlice.reducer