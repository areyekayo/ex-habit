import {createSlice, createAsyncThunk, createEntityAdapter} from "@reduxjs/toolkit";
import { updateUserEntry } from "../users/userSlice";
import { addEntryToTrigger } from "../triggers/triggerSlice";

const entriesAdapter = createEntityAdapter({
    sortComparer: (a, b) => new Date(b.created_timestamp) - new Date(a.created_timestamp),
});

const initialState = entriesAdapter.getInitialState({
    status: 'idle',
    error: null
})

export const addEntry = createAsyncThunk(
    'entries/addEntry',
    async (newEntry, thunkAPI) => {
        const response = await fetch('/entries', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newEntry)
        });
        if (!response.ok) throw new Error('Failed to add entry');
        const data = await response.json();
        const triggerId = data['trigger_id']
        const entryId = data['entry_id']
        const state = thunkAPI.getState();

        thunkAPI.dispatch(addEntryToTrigger(data))
        return data
    }
);

export const updateEntry = createAsyncThunk(
    'entries/updateEntry',
    async (entry) => {
        const response = await fetch(`/entries/${entry.id}`, {
            method: "PATCH",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(entry)
        })
        if (!response.ok) throw new Error('Failed to update entry');
        const data = await response.json()
        return data
    }
)

const entrySlice = createSlice({
    name: 'entries',
    initialState,
    reducers: {
        setAllEntries(state, action) {
            entriesAdapter.setAll(state, action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(addEntry.pending, (state) => {
                state.status = "loading";
            })
            .addCase(addEntry.fulfilled, (state, action) => {
                state.status = "succeeded";
                entriesAdapter.addOne(state, action.payload);
            })
            .addCase(addEntry.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
            .addCase(updateEntry.pending, (state) => {
                state.status = "loading";
            })
            .addCase(updateEntry.fulfilled, (state, action) => {
                state.status = "succeeded";
                entriesAdapter.upsertOne(state, action.payload);
            })
            .addCase(updateEntry.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
    }
})

export const {
    selectAll: selectAllEntries,
    selectById: selectEntryById,
    selectIds: selectEntryIds,
} = entriesAdapter.getSelectors(state => state.entries)

export const {setAllEntries} = entrySlice.actions;
export default entrySlice.reducer;