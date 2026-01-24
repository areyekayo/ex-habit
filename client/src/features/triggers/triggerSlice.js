import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { addTriggerToUser } from "../users/userSlice";

export const fetchTriggers = createAsyncThunk(
    'triggers/fetchTriggers',
    async () => {
        const response = await fetch('/triggers');
        if (!response.ok) {
            throw new Error('Failed to fetch triggers');
        }
        return await response.json()
    }
)

export const addTrigger = createAsyncThunk(
    'triggers/addTrigger',
    async (newTrigger, thunkAPI) => {
        const response = await fetch('/triggers', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newTrigger)
        });
        if (!response.ok) throw new Error('Failed to add trigger');
        const data = await response.json()
        thunkAPI.dispatch(addTriggerToUser({
            data
        }))
        
    }
)

const triggerSlice = createSlice({
    name: 'triggers',
    initialState: {
        list: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTriggers.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchTriggers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.list = action.payload;
            })
            .addCase(fetchTriggers.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
    }
});
export const {addEntryToTrigger} = triggerSlice.actions;
export default triggerSlice.reducer