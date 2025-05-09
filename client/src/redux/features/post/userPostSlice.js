import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import client from "../../../lib/axios";
import * as SecureStore from 'expo-secure-store';

const initialState = {
    post: [], // List of posts
    loading: false, // Indicates whether the posts are being loaded
    error: null, // Stores any error during API calls
};

// Async thunk to fetch posts from the backend
export const fetchUserPosts = createAsyncThunk('posts/fetchUserPosts', async (_, { rejectWithValue }) => {
    try {
        const token = await SecureStore.getItemAsync('authToken'); // Fetch token securely
        const response = await client.get('/post/get-user-posts', {
            headers: { Authorization: `Bearer ${token}` }
        }); // API call to fetch posts
        return response.data; // Return fetched data
    } catch (error) {
        console.error("Error fetching posts:", error);
        return rejectWithValue(error.response?.data || error.message); // Handle errors gracefully
    }
});

export const userPostSlice = createSlice({
    name: "userpost",
    initialState,
    reducers: {
        // Manually set posts
        setUserPosts: (state, action) => {
            state.post = action.payload;
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
            .addCase(fetchUserPosts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            // Handle fulfilled state
            .addCase(fetchUserPosts.fulfilled, (state, action) => {
                state.loading = false;
                state.post = action.payload.post; // Assuming the API returns a `post` field
            })
            // Handle rejected state
            .addCase(fetchUserPosts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch posts";
            });
    },
});

// Export actions
export const { setLoading, setError, setUserPosts } = userPostSlice.actions;

// Selector for posts
export const selectUserPost = (state) => state.post;

export default userPostSlice.reducer;
