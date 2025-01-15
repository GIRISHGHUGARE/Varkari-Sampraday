import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./features/auth/authSlice";
import { postSlice } from "./features/post/postSlice";

const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        post: postSlice.reducer
    }
});

export default store;