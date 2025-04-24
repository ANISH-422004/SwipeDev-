import { createSlice } from '@reduxjs/toolkit'



export const user = createSlice({
  name: 'user',
  initialState:null,
  reducers: {
    addUser : (state, action)=>{
        return action.payload
    },
    removeUser : (action,payload)=>{
        return null
    },
    updateUser : (action,payload)=>{
        return action.payload
    },

  },
})

// Action creators are generated for each case reducer function
export const { addUser , removeUser , updateUser } = user.actions

export default user.reducer