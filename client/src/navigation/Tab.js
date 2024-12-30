import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector, useDispatch } from 'react-redux';
import * as SecureStore from 'expo-secure-store';
import { login, setLoading, setError } from '../redux/features/auth/authSlice.js';
import { selectUser, selectIsVerified } from '../redux/features/auth/authSlice.js';
import axios from 'axios';

// Import your screens
import Home from "../screens/tabs/Home.js";
import Tracker from "../screens/tabs/Tracker.js";
import Post from "../screens/tabs/Post.js";
import Product from "../screens/tabs/Product.js";
import Profile from "../screens/tabs/Profile.js";
import Login from "../screens/auth/Login.js";
import SignUp from "../screens/auth/SignUp.js";

const Stack = createNativeStackNavigator();

const Tab = () => {
    const dispatch = useDispatch();

    // Fetch token and authenticate user on app load
    useEffect(() => {
        const checkAuth = async () => {
            const token = await SecureStore.getItemAsync('authToken');
            console.log("Token from SecureStore:", token); // Debugging line
            if (token) {
                try {
                    dispatch(setLoading(true));
                    const response = await axios.get('http://192.168.0.114:8080/api/v1/auth/verify-user', {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    console.log("Response from verify-user:", response); // Debugging line
                    if (response.data.success && response.data.user) {
                        // Dispatch user data to Redux store
                        dispatch(login(response.data.user));
                    } else {
                        dispatch(setError('Authentication failed'));
                    }
                } catch (error) {
                    dispatch(setError('Token verification failed'));
                    console.error("Error during token verification:", error);
                } finally {
                    dispatch(setLoading(false));
                }
            }
        };

        checkAuth();
    }, [dispatch]);

    const username = useSelector(selectUser);
    const isVerified = useSelector(selectIsVerified);
    const authenticatedUser = username && isVerified;

    // Navigate based on authentication status
    return (
        <Stack.Navigator initialRouteName={authenticatedUser ? "Home" : "Login"}>
            {authenticatedUser ? (
                <>
                    <Stack.Screen name="Home" component={Home} options={{ title: "" }} />
                    <Stack.Screen name="Tracker" component={Tracker} options={{ headerBackTitle: 'Back' }} />
                    <Stack.Screen name="Post" component={Post} options={{ headerBackTitle: 'Back' }} />
                    <Stack.Screen name="Product" component={Product} options={{ headerBackTitle: 'Back' }} />
                    <Stack.Screen name="Profile" component={Profile} options={{ headerBackTitle: 'Back' }} />
                </>
            ) : (
                <>
                    <Stack.Screen
                        name="SignUp"
                        component={SignUp}
                        options={{
                            headerShown: true,
                            title: "Sign Up",
                            headerStyle: { backgroundColor: '#812F21' },
                            headerTitleAlign: 'center',
                        }}
                    />
                    <Stack.Screen
                        name="Login"
                        component={Login}
                        options={{
                            headerShown: true,
                            title: "Login",
                            headerStyle: { backgroundColor: '#812F21' },
                            headerTitleAlign: 'center',
                        }}
                    />
                </>
            )}
        </Stack.Navigator>
    );
};

export default Tab;
