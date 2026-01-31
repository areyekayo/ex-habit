import { configureStore } from "@reduxjs/toolkit";
import behaviorReducer from "./features/behaviors/behaviorSlice";
import userReducer from "./features/users/userSlice";

export const store = configureStore({
    reducer: {
        behaviors: behaviorReducer,
        user: userReducer,
    }
});