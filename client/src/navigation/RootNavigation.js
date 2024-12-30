import React, { useEffect } from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector, useDispatch } from 'react-redux';
import * as SecureStore from 'expo-secure-store';
import { login, setLoading, setError } from '../redux/features/auth/authSlice.js';
import { selectUser, selectIsVerified } from '../redux/features/auth/authSlice.js';
import axios from 'axios';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';

// Import your screens
import Home from "../screens/tabs/Home.js";
import Tracker from "../screens/tabs/Tracker.js";
import Post from "../screens/tabs/Post.js";
import Product from "../screens/tabs/Product.js";
import Profile from "../screens/tabs/Profile.js";
import Login from "../screens/auth/Login.js";
import SignUp from "../screens/auth/SignUp.js";


const Stack = createNativeStackNavigator();

const RootNavigation = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const handleLogout = async () => {
        try {
            dispatch(login(""));
            await SecureStore.deleteItemAsync('authToken');
            const data = await axios.delete('http://192.168.0.114:8080/api/v1/auth/logout');
            Alert.alert("Success", data.message);
            navigation.navigate('Login');
        } catch (error) {
            console.error("Error error in logout", error);
        }

    };
    // Fetch token and authenticate user on app load
    useEffect(() => {
        const checkAuth = async () => {
            const token = await SecureStore.getItemAsync('authToken');
            if (token) {
                try {
                    dispatch(setLoading(true));
                    const response = await axios.get('http://192.168.0.114:8080/api/v1/auth/verify-user', {
                        headers: { Authorization: `Bearer ${token}` },
                    });
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
                    <Stack.Screen name="Profile" component={Profile} options={{
                        headerBackTitle: 'Back', headerRight: () =>
                            <View>
                                <TouchableOpacity onPress={handleLogout}>
                                    <FontAwesome5 name="sign-out-alt" style={{ fontSize: 25, color: "black" }} />
                                </TouchableOpacity>
                            </View>

                    }} />
                </>
            ) : (
                <>
                    <Stack.Screen
                        name="SignUp"
                        component={SignUp}
                        options={{
                            headerShown: false,
                            title: "Sign Up",
                            headerStyle: { backgroundColor: '#812F21' },
                            headerTitleAlign: 'center',
                        }}
                    />
                    <Stack.Screen
                        name="Login"
                        component={Login}
                        options={{
                            headerShown: false,
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

export default RootNavigation;
