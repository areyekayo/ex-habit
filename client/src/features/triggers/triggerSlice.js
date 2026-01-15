import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

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

export default triggerSlice.reducer