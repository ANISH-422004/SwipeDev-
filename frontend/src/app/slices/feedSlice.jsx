import { createSlice } from '@reduxjs/toolkit'


export const feed = createSlice({
    name: 'feed',
    initialState: null,
    reducers: {
        addFeed: (state, action) => {
        return action.payload
        },
        removeFeed: (state, action) => {
        return null
        },
        updateFeed: (state, action) => {
        return action.payload
        },
        removeUserFromFeed : (state, action) => {
            return state.filter((user)=> user._id!==action.payload)
        }
    },
})


// Action creators are generated for each case reducer function
export const { addFeed, removeFeed, updateFeed ,removeUserFromFeed} = feed.actions

export default feed.reducer