import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from 'reselect';

const initialState = {
    user: {
        _id: null,
        username: null,
        email: null,
        isVerified: null,
    },
    loading: false,
    error: null
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            // Update the user object with the data from the payload
            state.user._id = action.payload._id; // Assuming payload contains _id
            state.user.username = action.payload.username; // Assuming payload contains username
            state.user.email = action.payload.email; // Assuming payload contains email
            state.user.isVerified = action.payload.isVerified; // Assuming payload contains isVerified
            state.loading = false;
            state.error = null;
        },
        logout: (state) => {
            // Reset the user object to initial state on logout
            state.user = {
                _id: null,
                username: null,
                email: null,
                isVerified: null,
            };
            state.loading = false;
            state.error = null;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        }
    }
});

// Export actions
export const { login, logout, setLoading, setError } = authSlice.actions;

// Selectors
export const selectAuth = (state) => state.auth; // Ensure this matches the key in the store
export const selectUser = (state) => state.auth.user.username;
export const selectIsVerified = (state) => state.auth.user.isVerified;

export default authSlice.reducer;