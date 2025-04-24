import{ createSlice} from "@reduxjs/toolkit"



const requestsSlice = createSlice({
    name: "requests",
    initialState: null,
    reducers: {
        setRequests: (state, action) => {
            return action.payload;
        },
        clearRequests: (state, action) => {
            return null;
        },
    },
})   


export const { setRequests, clearRequests } = requestsSlice.actions;
export default requestsSlice.reducer;
