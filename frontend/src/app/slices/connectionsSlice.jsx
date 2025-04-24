import { createSlice } from "@reduxjs/toolkit" ;



const connectionsSlice = createSlice({
    name: "connections",
    initialState:null , 
    reducers: {
        setConnections: (state, action) => {
            return action.payload;
        },
        clearConnections: (state, action) => {
            return null;
        },
    },
})

export const { setConnections, clearConnections } = connectionsSlice.actions;
export default connectionsSlice.reducer;