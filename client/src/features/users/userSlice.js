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

export const updateTrigger = createAsyncThunk(
    'triggers/updateTrigger',
    async (trigger) => {
        const response = await fetch(`/triggers/${trigger.id}`, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(trigger)
        })
        if (!response.ok) throw new Error('Failed to update trigger');
        const data = await response.json()
        return data
    }
)

export const deleteTrigger = createAsyncThunk(
    'triggers/deleteTrigger',
    async (trigger) => {
        const response = await fetch(`/triggers/${trigger.id}`, {
            method: 'DELETE'
        })
        if (!response.ok) throw new Error('Failed to delete trigger');
        return trigger
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

export const deleteEntry = createAsyncThunk(
    'entries/deleteEntry',
    async (entry) => {
        const response = await fetch(`/entries/${entry.id}`, {
            method: "DELETE"
        })
        if (!response.ok) throw new Error('Failed to delete entry');
        return entry
    }
)

function normalizeUserResponse(userApiResponse) {
    // normalizes the user's nested triggers, behaviors, and entries
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
            if (!behaviorIdsForTrigger.includes(behavior.id)){
                behaviorIdsForTrigger.push(behavior.id);
            }

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

export const signUpUser = createAsyncThunk(
    'user/signUp',
    async (userCredentials, thunkAPI) => {
        const {rejectWithValue} = thunkAPI
        try {
            const response = await fetch('/signup', {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(userCredentials),
            });
            if (!response.ok){
                const errorData = await response.json()
                return rejectWithValue(errorData.errors)
            }
            const data = await response.json()
            return normalizeUserResponse(data)
        } catch (error) {
            return rejectWithValue({signup: [error.message]})
        }
    }
)

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
            .addCase(signUpUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(signUpUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload.user;
                state.isAuthenticated = true;
                state.error = null;
                triggersAdapter.setAll(state.triggers, Object.values(action.payload.triggers.entities));
                entriesAdapter.setAll(state.entries, Object.values(action.payload.entries.entities))
            })
            .addCase(signUpUser.rejected, (state, action) => {
                state.status = 'failed';
                state.user = null;
                state.error = action.payload || action.error.message ;
                state.isAuthenticated = false;
            })
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
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
                triggersAdapter.addOne(state.triggers, action.payload)
                if (state.user) {
                    state.user.triggerIds.push(action.payload.id)
                }
            })
            .addCase(createTrigger.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(updateTrigger.pending, (state) => {
                state.status = "loading";
            })
            .addCase(updateTrigger.fulfilled, (state, action) => {
                state.status = "succeeded";
                triggersAdapter.upsertOne(state.triggers, action.payload);
            })
            .addCase(updateTrigger.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
            .addCase(addEntry.pending, (state) => {
                state.status = "loading";
            })
            .addCase(addEntry.fulfilled, (state, action) => {
                state.status = "succeeded";
                const newEntry = action.payload
                entriesAdapter.addOne(state.entries, newEntry);
                if (state.user) {
                    state.user.entryIds.push(newEntry.id) // add entry ID to user
                    const existingBehaviorIds = state.user.behaviorIds || [];
                    // add entry's behavior to user's behavior IDs if not present
                    if (!existingBehaviorIds.includes(newEntry.behavior_id)){
                        state.user.behaviorIds = [...existingBehaviorIds, newEntry.behavior_id]
                    }
                }
                const trigger = state.triggers.entities[newEntry.trigger_id];
                if (trigger) { // add entry ID to trigger
                    const existingEntryIds = trigger.entryIds || [];
                    if (!existingEntryIds.includes(newEntry.id)){
                        trigger.entryIds = [...existingEntryIds, newEntry.id]
                    }
                    const existingTriggerBehaviorIds = trigger.behaviorIds || [];
                    if (!existingTriggerBehaviorIds.includes(newEntry.behavior_id)){ // add entry's behavior to trigger if not present
                        trigger.behaviorIds = [...existingTriggerBehaviorIds, newEntry.behavior_id]
                    }
                }

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
                entriesAdapter.upsertOne(state.entries, action.payload);
            })
            .addCase(updateEntry.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
            .addCase(deleteEntry.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(deleteEntry.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const deletedEntry = action.payload;
                const entryId = deletedEntry.id
                const behaviorId = deletedEntry.behavior_id;
                const triggerId = deletedEntry.trigger_id;

                entriesAdapter.removeOne(state.entries, entryId);

                if (state.user) {
                    const existingEntryIds = state.user.entryIds;
                    if (existingEntryIds.includes(entryId)){
                        state.user.entryIds = existingEntryIds.filter(id => id !== entryId)
                    }
                }
                const trigger = state.triggers.entities[triggerId]
                if (trigger) { //remove the entryId from associated trigger
                    const existingEntryIds = trigger.entryIds;
                    if (existingEntryIds.includes(entryId)){
                        trigger.entryIds = existingEntryIds.filter(id => id !== entryId)
                    }
                }
                // check if the associated behavior is used in other entries
                const behaviorStillExists = state.entries.ids.some(id => {
                    const entry = state.entries.entities[id];
                    return entry && entry.behavior_id === behaviorId
                })
                if (!behaviorStillExists) { //if no entry uses the behavior, remove the behavior Id from trigger and user
                    trigger.behaviorIds = trigger.behaviorIds.filter(id => id !== behaviorId)
                    state.user.behaviorIds = state.user.behaviorIds.filter(id => id !== behaviorId)
                }
            })
            .addCase(deleteTrigger.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(deleteTrigger.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const deletedTrigger = action.payload
                const triggerId = deletedTrigger.id
                const entryIds = state.triggers.entities[triggerId]?.entryIds || [];
                triggersAdapter.removeOne(state.triggers, triggerId)

                entryIds.forEach(entryId => { // remove the trigger's entries from state
                    entriesAdapter.removeOne(state.entries, entryId);
                    if (state.user) { // remove entryIds from user
                        state.user.entryids = state.user.entryIds.filter(id => id !== entryId)
                    }
                });
                
                if (state.user) { // remove the triggerId from user.triggerIds
                    state.user.triggerIds = state.user.triggerIds.filter(id => id !== triggerId)
                    // check remaining entries for behaviors still in use
                    const remainingEntries = Object.values(state.entries.entities);
                    const behaviorsStillInUse = new Set(
                        remainingEntries.map(entry => entry.behavior_id)
                    );
                    // remove user behaviors that are no longer in use
                    state.user.behaviorIds = state.user.behaviorIds.filter(behaviorId => behaviorsStillInUse.has(behaviorId))
                }
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