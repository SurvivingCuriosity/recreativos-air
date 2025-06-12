import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../../interfaces/User';
import type { RootState } from '../store';
import { LoggedInUser } from '../tmp/LoggedInUser';

export interface AuthState {
  token: string | null;
  user: User|null
}

const initialState: AuthState = {
  token: localStorage.getItem('token'),
  user: LoggedInUser
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setearUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    loginSucceeded(state, action: PayloadAction<string>) {
      state.token = action.payload;
      state.user = LoggedInUser
      localStorage.setItem('token', action.payload);
    },
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
  },
});

export const { loginSucceeded, logout, setearUser } = authSlice.actions;
export const selectIsAuthenticated = (s: RootState) => Boolean(s.auth.token);
export default authSlice.reducer;
