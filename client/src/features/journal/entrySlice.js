import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import { addEntryToTriggerBehavior } from "../users/userSlice";

export const addEntry = createAsyncThunk(
    'entries/addEntry',
    async (newEntry, thunkAPI) => {
        const response = await fetch('/entries', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newEntry)
        });
        if (!response.ok) throw new Error('Failed to add entry');
        const data = await response.json()
        const state = thunkAPI.getState();
        const behavior = state.behaviors.list.find(b => b.id === data.behavior_id)
        thunkAPI.dispatch(addEntryToTriggerBehavior({
            triggerId: data.trigger_id, 
            behaviorId: data.behavior_id,
            behavior, 
            entry: data}));
        return data
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
            .addCase(addEntry.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.list = action.payload;
            })
    }
})

export default entrySlice.reducer;