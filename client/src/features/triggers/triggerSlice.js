// import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";

// const triggersAdapter = createEntityAdapter({
//     sortComparer: (a, b) => a.name.localeCompare(b.name)
// });

// const initialState = triggersAdapter.getInitialState({
//     status: 'idle',
//     error: null
// })

// export const createTrigger = createAsyncThunk(
//     'triggers/addTrigger',
//     async (newTrigger, thunkAPI) => {
//         const response = await fetch('/triggers', {
//             method: 'POST',
//             headers: {'Content-Type': 'application/json'},
//             body: JSON.stringify(newTrigger)
//         });
//         if (!response.ok) throw new Error('Failed to add trigger');
//         const data = await response.json()
//         thunkAPI.dispatch(addTriggerToUser(data.id))
//         return data
//     }
// )


// const triggerSlice = createSlice({
//     name: 'triggers',
//     initialState,
//     reducers: {
//         setAllTriggers(state, action) {
//             triggersAdapter.setAll(state, action.payload);
//         },
//         addTrigger: triggersAdapter.addOne,
//         updateTrigger: triggersAdapter.updateOne,
//         removeTrigger: triggersAdapter.removeOne,
//         addEntryToTrigger(state, action) {
//             const {triggerId, entryId} = action.payload;
//             const trigger = state.triggers.entities[triggerId];
//             if (trigger) {
//                 if (!trigger.entryIds) {
//                     trigger.entryIds = []
//                 }
//                 if (!trigger.entryIds.includes(entryId)){
//                     trigger.entryIds.push(entryId)
//                 }
//             }
//         },
//     },
//     extraReducers: (builder) => {
//         builder
//             .addCase(createTrigger.pending, (state) => {
//                 state.status = "loading";
//             })
//             .addCase(createTrigger.fulfilled, (state, action) => {
//                 state.status = "succeeded";
//                 triggersAdapter.addOne(state, action.payload)
//             })
//             .addCase(createTrigger.rejected, (state, action) => {
//                 state.status = 'failed';
//                 state.error = action.error.message;
//             })
//     }
// });
// export const {
//     selectAll: selectAllTriggers,
//     selectById: selectTriggerById,
//     selectIds: selectTriggerIds,
// } = triggersAdapter.getSelectors(state => state.triggers);

// export const {setAllTriggers, addTrigger, updateTrigger, removeTrigger, addEntryToTrigger} = triggerSlice.actions;
// export default triggerSlice.reducer