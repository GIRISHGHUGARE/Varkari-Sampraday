import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import client from "../../../lib/axios";
import * as SecureStore from 'expo-secure-store';

const initialState = {
    product: [], // List of posts
    loading: false, // Indicates whether the posts are being loaded
    error: null, // Stores any error during API calls
};

// Async thunk to fetch posts from the backend
export const fetchProducts = createAsyncThunk('product/fetchProducts', async (_, { rejectWithValue }) => {
    try {
        const token = await SecureStore.getItemAsync('authToken'); // Fetch token securely
        const response = await client.get('/product/get-product', {
            headers: { Authorization: `Bearer ${token}` }
        }); // API call to fetch posts
        return response.data; // Return fetched data
    } catch (error) {
        console.error("Error fetching products:", error);
        return rejectWithValue(error.response?.data || error.message); // Handle errors gracefully
    }
});

export const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        // Manually set posts
        setProducts: (state, action) => {
            state.product = action.payload;
        },
        // Set loading state
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        // Set error
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Handle pending state
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            // Handle fulfilled state
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.product = action.payload.product; // Assuming the API returns a `post` field
            })
            // Handle rejected state
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch products";
            });
    },
});

// Export actions
export const { setLoading, setError, setProducts } = productSlice.actions;

// Selector for posts
export const selectProduct = (state) => state.product;

export default productSlice.reducer;
