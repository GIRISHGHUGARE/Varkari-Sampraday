import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: {
        _id: null,
        username: null,
        email: null,
        profilePhoto: null,
        summary: null,
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
            state.user.profilePhoto = action.payload.profilePhoto;
            state.user.summary = action.payload.summary;
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
export const selectUserId = (state) => state.auth.user._id;
export const selectUser = (state) => state.auth.user.username;
export const selectUserEmail = (state) => state.auth.user.email;
export const selectUserProfilePhoto = (state) => state.auth.user.profilePhoto;
export const selectUserSummary = (state) => state.auth.user.summary;
export const selectIsVerified = (state) => state.auth.user.isVerified;

export default authSlice.reducer;