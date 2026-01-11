import { configureStore } from "@reduxjs/toolkit";
import behaviorReducer from "./features/behaviors/behaviorSlice";

export const store = configureStore({
    reducer: {
        behaviors: behaviorReducer
    }
});