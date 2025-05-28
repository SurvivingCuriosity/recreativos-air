import { configureStore } from '@reduxjs/toolkit'
import { ligasReducer } from './slices/ligasSlice'
import authReducer from './slices/authSlice'
import userReducer from './slices/userSlice'

export const store = configureStore({
  reducer: {
    ligas: ligasReducer,
    auth: authReducer,
    user: userReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch