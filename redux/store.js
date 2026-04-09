import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import authSliceReducer from './slices/authSlice'

/** Persist configuration */
const persistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'token', 'isAuthenticated'], /** Only persist specific auth fields */
  blacklist: ['isLoading', 'error', 'otpRequired', 'otpEmail'], /** Don't persist these fields */
}

/** Create persisted reducer */
const persistedAuthReducer = persistReducer(persistConfig, authSliceReducer)

/** Configure store */
export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/REGISTER', 'persist/PURGE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
})

/** Create persistor */
export const persistor = persistStore(store)
