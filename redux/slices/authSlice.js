import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

/** Async thunks */
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        return rejectWithValue(data.message || 'Login failed')
      }

      return data
    } catch (error) {
      return rejectWithValue(error.message || 'Login failed')
    }
  }
)

export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      })

      const data = await response.json()

      if (!response.ok) {
        return rejectWithValue(data.message || 'OTP verification failed')
      }

      return data
    } catch (error) {
      return rejectWithValue(error.message || 'OTP verification failed')
    }
  }
)

export const resendOTP = createAsyncThunk(
  'auth/resendOTP',
  async (email, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        return rejectWithValue(data.message || 'Resend OTP failed')
      }

      return data
    } catch (error) {
      return rejectWithValue(error.message || 'Resend OTP failed')
    }
  }
)

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      })

      if (!response.ok) {
        return rejectWithValue('Logout failed')
      }

      return { success: true }
    } catch (error) {
      return rejectWithValue(error.message || 'Logout failed')
    }
  }
)

/** Initial state */
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  otpRequired: false,
  otpEmail: null,
}

/** Auth slice */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },

    setUser: (state, action) => {
      state.user = action.payload
      state.isAuthenticated = true
    },

    clearAuth: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.error = null
      state.otpRequired = false
      state.otpEmail = null
    },

    setOTPRequired: (state, action) => {
      state.otpRequired = action.payload.required
      state.otpEmail = action.payload.email
    },
  },

  extraReducers: (builder) => {
    builder
      /** Login */
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.data.user
        state.token = action.payload.data.token
        state.isAuthenticated = true
        state.otpRequired = false
        state.otpEmail = null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
        /** Check if OTP is required */
        if (action.payload?.includes('Email not verified') || action.payload?.includes('OTP sent')) {
          state.otpRequired = true
        }
      })

      /** Verify OTP */
      .addCase(verifyOTP.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.data.user
        state.token = action.payload.data.token
        state.isAuthenticated = true
        state.otpRequired = false
        state.otpEmail = null
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

      /** Resend OTP */
      .addCase(resendOTP.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(resendOTP.fulfilled, (state) => {
        state.isLoading = false
      })
      .addCase(resendOTP.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

      /** Logout */
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
        state.token = null
        state.isAuthenticated = false
        state.error = null
        state.otpRequired = false
        state.otpEmail = null
      })
  },
})

export const { clearError, setUser, clearAuth, setOTPRequired } = authSlice.actions
export default authSlice.reducer
