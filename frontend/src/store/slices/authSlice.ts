import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface User {
  id: string
  email: string
  name: string
  role: string
  outletId?: string;
  outletName?: string;
  permissions?: string[];
  avatar?: string;
  lastLoginAt?: string;
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
  loginLoading: boolean;
  logoutLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('auth_token') || null,
  isAuthenticated: false,
  loading: false,
  error: null,
  loginLoading: false,
  logoutLoading: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true
      state.error = null
      state.loginLoading = true;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.loading = false
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
      state.error = null
      localStorage.setItem('auth_token', action.payload.token);
      state.loginLoading = false;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
      state.isAuthenticated = false
      state.loginLoading = false;
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.error = null
      localStorage.removeItem('auth_token');
    },
    clearError: (state) => {
      state.error = null
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },

    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('auth_token', action.payload);
    },

    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('auth_token');
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
  // extraReducers: (builder) => {   builder     .addCase(login.pending, (state) => {
  //       state.loginLoading = true;
  //       state.error = null;
  //     })     .addCase(login.fulfilled, (state, action) => {
  //       state.loginLoading = false;
  //       state.user = action.payload.user;
  //       state.token = action.payload.token;
  //       state.isAuthenticated = true;
  //     })     .addCase(login.rejected, (state, action) => {
  //       state.loginLoading = false;
  //       state.error = action.payload as string;
  //     });
  // }
})

export const { loginStart, loginSuccess, loginFailure, logout, clearError, setUser, setToken, clearAuth, setError, updateUser } = authSlice.actions
export default authSlice.reducer