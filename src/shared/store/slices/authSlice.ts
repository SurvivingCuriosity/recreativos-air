import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import type { User } from '../../interfaces/User';

export interface AuthState {
  token: string | null;
  user: User|null
}

const initialState: AuthState = {
  token: localStorage.getItem('token'),
  user: {
    id: '1',
    username: 'alberto',
    nombre: 'Alberto',
    admin: true
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSucceeded(state, action: PayloadAction<string>) {
      state.token = action.payload;
      localStorage.setItem('token', action.payload);
    },
    logout(state) {
      state.token = null;
      localStorage.removeItem('token');
    },
  },
});

export const { loginSucceeded, logout } = authSlice.actions;
export const selectIsAuthenticated = (s: RootState) => Boolean(s.auth.token);
export default authSlice.reducer;
