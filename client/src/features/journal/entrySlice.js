import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";


export const addEntry = createAsyncThunk(
    'entries/addEntry',
    async (newEntry) => {
        const response = await fetch('/entries', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newEntry)
        });
        if (!response.ok) throw new Error('Failed to add entry');
        return await response.json()
    }
);

const entrySlice = createSlice({
    name: 'entries',
    initialState: {
        list: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addEntry.fulfilled, (state,action) => {
                state.list.push(action.payload);
            })
    }
})

export default entrySlice.reducer;