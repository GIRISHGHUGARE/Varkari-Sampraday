import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./features/auth/authSlice";
import { postSlice } from "./features/post/postSlice";
import { userPostSlice } from "./features/post/userPostSlice";

const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        post: postSlice.reducer,
        userpost: userPostSlice.reducer
    }
});

export default store;