import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slices/userSlice'
import feedReducer from './slices/feedSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    feed: feedReducer,
  },
})

