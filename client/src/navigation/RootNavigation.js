import React, { useEffect } from 'react';
import { View, TouchableOpacity, Alert, TextInput } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useSelector, useDispatch } from 'react-redux';
import * as SecureStore from 'expo-secure-store';
import { login, setLoading, setError } from '../redux/features/auth/authSlice.js';
import { selectUser, selectIsVerified } from '../redux/features/auth/authSlice.js';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';


// File imports
import Home from "../screens/tabs/Home.js";
import Tracker from "../screens/tabs/Tracker.js";
import Post from "../screens/tabs/Post.js";
import Product from "../screens/tabs/Product.js";
import Profile from "../screens/tabs/Profile.js";
import Login from "../screens/auth/Login.js";
import SignUp from "../screens/auth/SignUp.js";
import OtpScreen from '../screens/auth/OtpScreen.js';
import client from '../lib/axios.js';
import Story from '../screens/tabs/Story.js';


const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const DrawerNavigation = () => {
    return (
        <Drawer.Navigator
            screenOptions={({ navigation }) => ({
                headerLeft: () => (
                    <TouchableOpacity
                        style={{ marginLeft: 20 }}
                        onPress={() => navigation.toggleDrawer()} // Toggle the drawer
                    >
                        <FontAwesome5 name="user-circle" size={24} color="black" />
                    </TouchableOpacity>
                ),
                headerTitle: () => (
                    <View style={{ flexDirection: 'row', justifyContent: "center", alignItems: 'center', marginLeft: 10 }}>
                        <TextInput
                            placeholder="Search..."
                            style={{
                                height: 40,
                                width: 200,
                                borderColor: 'gray',
                                borderWidth: 1,
                                borderRadius: 5,
                                paddingLeft: 10,
                                backgroundColor: 'white',
                            }}
                        />
                    </View>
                ),
                headerRight: () => (
                    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => console.log('Settings pressed')}>
                            <MaterialIcons name="message" style={{ fontSize: 25, color: "black", marginRight: 15 }} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => console.log('Settings pressed')}>
                            <MaterialIcons name="settings" style={{ fontSize: 25, color: "black", marginRight: 20 }} />
                        </TouchableOpacity>
                    </View>
                ),
            })}
        >
            <Drawer.Screen name="Home" component={Home} />
            <Drawer.Screen name="Profile" component={Profile} />
        </Drawer.Navigator>
    );
}

const RootNavigation = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const username = useSelector(selectUser);
    const isVerified = useSelector(selectIsVerified);
    const authenticatedUser = username && isVerified;

    const handleLogout = async () => {
        try {
            dispatch(login(""));
            await SecureStore.deleteItemAsync('authToken');
            const data = await client.delete('/auth/logout');
            Alert.alert("Success", data.message);
            navigation.navigate('Login');
        } catch (error) {
            console.error("Error in logout", error);
        }
    };

    // Fetch token and authenticate user on app load
    useEffect(() => {
        const checkAuth = async () => {
            const token = await SecureStore.getItemAsync('authToken');
            if (token) {
                try {
                    dispatch(setLoading(true));
                    const response = await client.get('/auth/verify-user', {
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

    // Navigate based on authentication status
    useEffect(() => {
        if (username) {
            if (isVerified) {
                navigation.navigate("Home");
            } else {
                navigation.navigate('OtpScreen');
            }
        } else {
            navigation.navigate('Login');
        }
    }, [username, isVerified, navigation]);

    return (
        <Stack.Navigator initialRouteName={authenticatedUser ? "Home" : "Login"}>
            {authenticatedUser ? (
                <>
                    <Stack.Screen name="Home" component={DrawerNavigation} options={{
                        headerShown: false,
                        headerLeft: () => (
                            <TouchableOpacity onPress={() => navigation.openDrawer()}>
                                <FontAwesome5 name="user-circle" style={{ fontSize: 25, color: "black", marginLeft: 5 }} />
                            </TouchableOpacity>
                        ),

                    }} />
                    <Stack.Screen name="Tracker" component={Tracker} options={{ headerBackTitle: 'Back', headerShown: false }} />
                    <Stack.Screen name="Post" component={Post} options={{ headerBackTitle: 'Back', headerShown: false }} />
                    <Stack.Screen name="Product" component={Product} options={{ headerBackTitle: 'Back', headerShown: false }} />
                    <Stack.Screen name="Story" component={Story} options={{ headerBackTitle: 'Back', headerShown: false }} />
                    <Stack.Screen name="Profile" component={Profile} options={{
                        // headerBackTitle: 'Back', headerRight: () =>
                        //     <View>
                        //         <TouchableOpacity onPress={handleLogout}>
                        //             <FontAwesome5 name="sign-out-alt" style={{ fontSize: 25, color: "black" }} />
                        //         </TouchableOpacity>
                        //     </View>
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
                        name="OtpScreen"
                        component={OtpScreen}
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

export { RootNavigation, DrawerNavigation };
