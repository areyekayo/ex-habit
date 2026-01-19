import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';


export const fetchBehaviors = createAsyncThunk(
    'behaviors/fetchBehaviors',
    async () => {
        const response = await fetch('/behaviors');
        if (!response.ok) {
            throw new Error('Failed to fetch behaviors');
        }
        return await response.json()
    }
);

export const addBehavior = createAsyncThunk(
    'behaviors/addBehavior',
    async (newBehavior) => {
        const response = await fetch('/behaviors', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newBehavior),
        });
        if (!response.ok) throw new Error('Failed to add behavior');
        return await response.json()
    }
)

const behaviorSlice = createSlice({
    name: 'behaviors',
    initialState: {
        list: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBehaviors.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchBehaviors.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.list = action.payload;
            })
            .addCase(fetchBehaviors.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(addBehavior.fulfilled, (state, action) => {
                state.list.push(action.payload);
            })
    }
});

export default behaviorSlice.reducer