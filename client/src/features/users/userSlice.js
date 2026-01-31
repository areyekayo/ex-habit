import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";


const triggersAdapter = createEntityAdapter({
    sortComparer: (a, b) => a.name.localeCompare(b.name)
});

const entriesAdapter = createEntityAdapter({
    sortComparer: (a, b) => new Date(b.created_timestamp) - new Date(a.created_timestamp),
});

const initialState = {
    user: null,
    isAuthenticated: false,
    status: 'idle',
    error: null,
    triggers: triggersAdapter.getInitialState(),
    entries: entriesAdapter.getInitialState()
}

export const createTrigger = createAsyncThunk(
    'triggers/addTrigger',
    async (newTrigger) => {
        const response = await fetch('/triggers', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newTrigger)
        });
        if (!response.ok) throw new Error('Failed to add trigger');
        const data = await response.json()
        return data
    }
)

export const addEntry = createAsyncThunk(
    'entries/addEntry',
    async (newEntry) => {
        const response = await fetch('/entries', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newEntry)
        });
        if (!response.ok) throw new Error('Failed to add entry');
        const data = await response.json();
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

function normalizeUserResponse(userApiResponse) {
    const user = {
        id: userApiResponse.id,
        username: userApiResponse.username,
        triggerIds: [],
        behaviorIds: [],
        entryIds: [],
    };
    const triggers = {};
    const entries = {};

    (userApiResponse.triggers || []).forEach(trigger => {
        user.triggerIds.push(trigger.id);

        const behaviorIdsForTrigger = [];
        const entryIdsForTrigger = [];
        (trigger.behaviors || []).forEach(behavior => {
            if (!user.behaviorIds.includes(behavior.id)){
                user.behaviorIds.push(behavior.id)
            }
            behaviorIdsForTrigger.push(behavior.id);

            const entryIdsForBehavior = [];
            (behavior.entries || []).forEach(entry => {
                entryIdsForBehavior.push(entry.id);
                entryIdsForTrigger.push(entry.id);
                user.entryIds.push(entry.id);
                entries[entry.id] = entry;
            });
        });
        triggers[trigger.id] = {
            id: trigger.id,
            name: trigger.name,
            description: trigger.description,
            entryIds: entryIdsForTrigger,
            behaviorIds: behaviorIdsForTrigger
        };
    });

    return {
        user,
        triggers: {
            entities: triggers,
            ids: Object.keys(triggers).map(id => parseInt(id)),
        },
        entries: {
            entities: entries,
            ids: Object.keys(entries).map(id => parseInt(id)),
        }
    }
}


export const loginUser = createAsyncThunk(
    'user/loginUser',
    async (userCredentials, thunkAPI) => {
        const {rejectWithValue} = thunkAPI;
        try {
        const response = await fetch('/login', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userCredentials),
            credentials: "include",
        });
        if (!response.ok) {
            const errorData = await response.json()
            return rejectWithValue(errorData.errors || {login: ["Login failed"]})
        }
        const data = await response.json()
        return normalizeUserResponse(data)
    } catch (error) {
        return rejectWithValue({login: [error.message]})
    }
});

export const fetchCurrentUser = createAsyncThunk(
    'user/fetchCurrentUser',
    async (_, {rejectWithValue}) => {
        try {
        const response = await fetch('/current_user', {credentials: "include"});
    
    if (!response.ok) {
        return rejectWithValue("Not logged in");
    }
    const data = await response.json();
    return normalizeUserResponse(data)

    }
    catch (error){
        return rejectWithValue(error.message)
    }
}
)

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logout(state) {
            state.user = null;
            state.status = "idle";
            state.error = null;
            state.isAuthenticated = false;
            triggersAdapter.removeAll(state.triggers);
            entriesAdapter.removeAll(state.entries);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                console.log("loginUser fulfilled payload:", action.payload)
                state.status = 'succeeded';
                state.user = action.payload.user;
                state.isAuthenticated = true;
                state.error = null;
                triggersAdapter.setAll(state.triggers, Object.values(action.payload.triggers.entities));
                entriesAdapter.setAll(state.entries, Object.values(action.payload.entries.entities));
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.user = null;
                state.error = action.payload || action.error.message;
                state.isAuthenticated = false;
                triggersAdapter.removeAll(state.triggers);
                entriesAdapter.removeAll(state.entries);
            })
            .addCase(fetchCurrentUser.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchCurrentUser.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.user = action.payload.user ;
                state.isAuthenticated = true;
                triggersAdapter.setAll(state.triggers, Object.values(action.payload.triggers.entities));
                entriesAdapter.setAll(state.entries, Object.values(action.payload.entries.entities));
            })
            .addCase(fetchCurrentUser.rejected, (state) => {
                state.status = "failed";
                state.user = null;
                state.isAuthenticated = false;
                triggersAdapter.removeAll(state.triggers);
                entriesAdapter.removeAll(state.entries);
            })
            .addCase(createTrigger.pending, (state) => {
                state.status = "loading";
            })
            .addCase(createTrigger.fulfilled, (state, action) => {
                state.status = "succeeded";
                triggersAdapter.addOne(state, action.payload)
            })
            .addCase(createTrigger.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
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

export const selectUser = (state) => state.user.user;
export const selectIsAuthenticated = (state) => state.user.isAuthenticated;
export const {
    selectAll: selectAllTriggers,
    selectById: selectTriggerById,
    selectIds: selectTriggerIds,
} = triggersAdapter.getSelectors(state => state.user.triggers);
export const {
    selectAll: selectAllEntries,
    selectById: selectEntryById,
    selectIds: selectEntryIds,
} = entriesAdapter.getSelectors(state => state.user.entries);
export const {logout} = userSlice.actions;
export default userSlice.reducer;