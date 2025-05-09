import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';
import client from '../../../lib/axios';

// Async Thunks to interact with the API

// Fetch cart
export const fetchCart = createAsyncThunk('cart/fetchCart', async () => {
    const token = await SecureStore.getItemAsync('authToken');
    const response = await client.get('/cart/get-cart', { headers: { Authorization: `Bearer ${token}` } });
    return response.data.cart;
});

// Add product to cart
export const addToCart = createAsyncThunk('cart/addToCart', async (productId) => {
    const token = await SecureStore.getItemAsync('authToken');
    const response = await client.post('/cart/add-to-cart', { productId, quantity: 1 }, { headers: { Authorization: `Bearer ${token}` } });
    return response.data.cart;
});

// Remove product from cart
export const removeFromCart = createAsyncThunk('cart/removeFromCart', async (productId) => {
    const token = await SecureStore.getItemAsync('authToken');
    const response = await client.delete(`/cart/remove-from-cart/${productId}`, { headers: { Authorization: `Bearer ${token}` } });
    return response.data.cart;
});

// Update quantity in cart
export const updateCartQuantity = createAsyncThunk('cart/updateCartQuantity', async ({ productId, quantity }) => {
    const token = await SecureStore.getItemAsync('authToken');
    const response = await client.put(`/cart/update-cart/${productId}`, { quantity }, { headers: { Authorization: `Bearer ${token}` } });
    return response.data.cart;
});

export const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload.products || [];
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.items = action.payload.products || [];
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.items = action.payload.products || [];
            })
            .addCase(updateCartQuantity.fulfilled, (state, action) => {
                state.items = action.payload.products || [];
            });
    },
});

export default cartSlice.reducer;
