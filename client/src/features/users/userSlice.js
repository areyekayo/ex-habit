import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setAllTriggers } from "../triggers/triggerSlice";
import { setAllEntries } from "../journal/entrySlice";

function normalizeUserResponse(userApiResponse) {
    const user = {
        id: userApiResponse.id,
        username: userApiResponse.username,
        triggerIds: [],
        behaviorIds: [],
        entryIds: [],
    };
    const triggers = {};
    const behaviors = {};
    const entries = {};

    userApiResponse.triggers.forEach(trigger => {
        user.triggerIds.push(trigger.id);

        const behaviorIdsForTrigger = [];
        const entryIdsForTrigger = [];
        trigger.behaviors.forEach(behavior => {
            if (!user.behaviorIds.includes(behavior.id)){
                user.behaviorIds.push(behavior.id)
            }
            behaviorIdsForTrigger.push(behavior.id);

            const entryIdsForBehavior = [];
            behavior.entries.forEach(entry => {
                entryIdsForBehavior.push(entry.id);
                entryIdsForTrigger.push(entry.id);
                user.entryIds.push(entry.id);
                entries[entry.id] = {
                    ...entry
                };
            });

            behaviors[behavior.id] = {
                ...behavior,
                entryIds: entryIdsForBehavior
            };
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
        behaviors: {
            entities: behaviors,
            ids: Object.keys(behaviors).map(id => parseInt(id)),
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
        const normalizedData = normalizeUserResponse(data)
        thunkAPI.dispatch(setAllTriggers(Object.values(normalizedData.triggers.entities)))
        thunkAPI.dispatch(setAllEntries(Object.values(normalizedData.entries.entities)))
        return normalizedData.user;
    } catch (error) {
        return rejectWithValue({login: [error.message]})
    }
});

export const fetchCurrentUser = createAsyncThunk(
    'user/fetchCurrentUser',
    async (_, {rejectWithValue, thunkAPI}) => {
        try {
        const response = await fetch('/current_user', {credentials: "include"});
    
    if (!response.ok) {
        return rejectWithValue("Not logged in");
    }
    const data = await response.json();
    const normalizedData = normalizeUserResponse(data)
    thunkAPI.dispatch({type: 'triggers/setAll', payload: normalizedData.triggers.entities})
    thunkAPI.dispatch({type: 'entries/setAll', payload: normalizedData.entries.entities})
    return normalizedData.user;

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
export const {logout} = userSlice.actions;
export default userSlice.reducer;