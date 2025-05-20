import { configureStore } from '@reduxjs/toolkit'
import { ligasReducer } from './slices/ligasSlice'
import authReducer from './slices/authSlice'

export const store = configureStore({
  reducer: {
    ligas: ligasReducer,
    auth: authReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch