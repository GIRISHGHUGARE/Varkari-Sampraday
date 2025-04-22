import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {
    _id: null,
    username: null,
    email: null,
    isVerified: null,
    isAdmin: null,
    profilePhoto: null,
  },
  loading: false,
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      const { _id, username, email, isVerified, isAdmin, profilePhoto } = action.payload;
      state.user._id = _id;
      state.user.username = username;
      state.user.email = email;
      state.user.isVerified = isVerified;
      state.user.isAdmin = isAdmin;
      state.user.profilePhoto = profilePhoto;
      state.loading = false;
      state.error = null;
    },
    logout: (state) => {
      console.log("Logout action triggered");
      state.user = {
        _id: null,
        username: null,
        email: null,
        isVerified: null,
        isAdmin: null,
        profilePhoto: null,
      };
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

// Export actions
export const { login, logout, setLoading, setError } = authSlice.actions;

// Selectors
export const selectAuth = (state) => state.auth; // Ensure this matches the key in the store
export const selectUser = (state) => state.auth.user;
export const selectIsAdmin = (state) => state.auth.user.isAdmin;
export const selectUserEmail = (state) => state.auth.user.email;
export const selectIsVerified = (state) => state.auth.user.isVerified;

export default authSlice.reducer;
