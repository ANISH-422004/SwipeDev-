import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slices/userSlice'
import feedReducer from './slices/feedSlice'
import connectionsReducer from './slices/connectionsSlice'


export const store = configureStore({
  reducer: {
    user: userReducer,
    feed: feedReducer,
    connections: connectionsReducer,
  },
})

