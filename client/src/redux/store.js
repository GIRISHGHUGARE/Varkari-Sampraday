import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./features/auth/authSlice";
import { postSlice } from "./features/post/postSlice";
import { userPostSlice } from "./features/post/userPostSlice";
import { productSlice } from "./features/product/productSlice";
import { cartSlice } from "./features/cart/cartSlice";

const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        post: postSlice.reducer,
        userpost: userPostSlice.reducer,
        product: productSlice.reducer,
        cart: cartSlice.reducer
    }
});

export default store;