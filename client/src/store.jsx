import { configureStore } from "@reduxjs/toolkit";
import behaviorReducer from "./features/behaviors/behaviorSlice";
import triggerReducer from "./features/triggers/triggerSlice";
import userReducer from "./features/users/userSlice";

export const store = configureStore({
    reducer: {
        behaviors: behaviorReducer,
        triggers: triggerReducer,
        user: userReducer
    }
});