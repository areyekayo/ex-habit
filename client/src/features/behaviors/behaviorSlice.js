import {createSlice, createAsyncThunk, createEntityAdapter} from '@reduxjs/toolkit';

const behaviorsAdapter = createEntityAdapter({
    sortComparer: (a,b) => a.name.localeCompare(b.name),
})

const initialState = behaviorsAdapter.getInitialState({
    status: 'idle',
    error: null
});

export const fetchBehaviors = createAsyncThunk(
    'behaviors/fetchBehaviors',
    async () => {
        const response = await fetch('/behaviors');
        if (!response.ok) {
            throw new Error('Failed to fetch behaviors');
        }
        const data = await response.json()

        return data
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
    initialState,
    reducers: {
        setAllBehaviors(state, action){
            behaviorsAdapter.setAll(state, action.payload);
        },
        addBehavior: behaviorsAdapter.addOne,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBehaviors.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchBehaviors.fulfilled, (state, action) => {
                state.status = 'succeeded';
                behaviorsAdapter.setAll(state, action.payload);
            })
            .addCase(fetchBehaviors.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(addBehavior.fulfilled, (state, action) => {
                behaviorsAdapter.addOne(state, action.payload);
            })
    }
});

export const {
    selectAll: selectAllBehaviors,
    selectById: selectBehaviorById,
    selectIds: selectBehaviorIds,
} = behaviorsAdapter.getSelectors(state => state.behaviors)
export const {addEntryToBehavior, setAllBehaviors } = behaviorSlice.actions

export default behaviorSlice.reducer