import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const loginUser = createAsyncThunk(
    'user/loginUser',
    async (userCredentials, {rejectWithValue}) => {
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
        return data;
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
    const user = await response.json();
    return user;
    }
    catch (error){
        return rejectWithValue(error.message)
    }
}
)

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
        status: 'idle',
        error: null,
        isAuthenticated: false
    },
    reducers: {
        logout(state) {
            state.user = null;
            state.status = "idle";
            state.error = null;
            state.isAuthenticated = false;
        },
        addEntryToTriggerBehavior(state, action) {
            const {triggerId, behaviorId, behavior, entry } = action.payload;
            const trigger = state.user.triggers.find(t => t.id === triggerId);
            if (!trigger) return;
            let existingBehavior = trigger.behaviors?.find(b => b.id === behaviorId);

            if(!existingBehavior) {
                if (!trigger.behaviors) trigger.behaviors = [];
                const newBehavior = {
                    ...behavior,
                    entries: behavior.entries ? [...behavior.entries] : [],
                };
                trigger.behaviors.push(newBehavior);
                existingBehavior = newBehavior
                state.user.behaviors.push(existingBehavior)
            }
            if (!existingBehavior.entries) existingBehavior.entries = []
            existingBehavior.entries.push(entry)

        },
        addTriggerToUser(state, action) {
            const trigger = action.payload;
            state.user.triggers = [...state.user.triggers, trigger]
        },
        updateUserEntry(state, action) {
            const updatedEntry = action.payload;
            if (!state.user || !state.user.triggers) return;

            // Create new triggers array with updated trigger
            const newTriggers = state.user.triggers.map(trigger => {
                if (trigger.id !== updatedEntry.trigger_id) return trigger;

                // Update behaviors for this trigger
                if (!trigger.behaviors) return trigger;

                const newBehaviors = trigger.behaviors.map(behavior => {
                    if (behavior.id !== updatedEntry.behavior_id) return behavior;

                    // Update entries for this behavior
                    const newEntries = behavior.entries.map(entry =>
                        entry.id === updatedEntry.id ? updatedEntry : entry
                    );

                    return {
                        ...behavior,
                        entries: newEntries
                    };
                });

                return {
                    ...trigger,
                    behaviors: newBehaviors
                };
            });

            // Replace the user object with updated triggers
            state.user = {
                ...state.user,
                triggers: newTriggers
            };
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload;
                state.isAuthenticated = true;
                state.error = false;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || action.error.message;
                state.isAuthenticated = false;
            })
            .addCase(fetchCurrentUser.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchCurrentUser.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.user = action.payload ;
                state.isAuthenticated = true;
            })
            .addCase(fetchCurrentUser.rejected, (state) => {
                state.status = "failed";
                state.user = null;
                state.isAuthenticated = false;
            })
    }
})
export const {logout, addEntryToTriggerBehavior, addTriggerToUser, updateUserEntry} = userSlice.actions;
export default userSlice.reducer;