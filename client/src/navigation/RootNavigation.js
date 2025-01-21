import React, { useEffect } from 'react';
import { View, TouchableOpacity, Alert, TextInput, StyleSheet, Text, Image } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { useSelector, useDispatch } from 'react-redux';
import * as SecureStore from 'expo-secure-store';
import { login, setLoading, setError } from '../redux/features/auth/authSlice.js';
import { selectUser, selectIsVerified } from '../redux/features/auth/authSlice.js';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';

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

// Create navigators
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// Access navigation from props
const CustomDrawerContent = (props) => {
    const { navigation } = props;
    const dispatch = useDispatch();

    const handleLogout = async () => {
        try {
            dispatch(login("")); // Clear login state
            await SecureStore.deleteItemAsync("authToken");
            const data = await client.delete("/auth/logout");
            Alert.alert("Success", data.message);
            navigation.navigate("Login");
        } catch (error) {
            console.error("Error in logout", error);
            Alert.alert("Error", "Failed to logout");
        }
    };

    return (
        <View style={{ flex: 1 }}>
            {/* Scrollable list of drawer items */}
            <DrawerContentScrollView {...props}>
                <DrawerItem
                    label="Profile"
                    onPress={() => props.navigation.navigate("Profile")}
                    icon={() => <FontAwesome6Icon name="circle-user" size={25} color="black" />}
                />
            </DrawerContentScrollView>

            {/* Logout Button at the Bottom */}
            <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
            >
                <MaterialIcons name="logout" size={24} color="black" />
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};
const DrawerNavigation = () => {
    const profilePhoto = useSelector((state) => state.auth.user.profilePhoto)
    return (
        <Drawer.Navigator
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={({ navigation }) => ({
                headerLeft: () => (
                    <TouchableOpacity
                        style={{ marginLeft: 20 }}
                        onPress={() => navigation.toggleDrawer()} // Toggle the drawer
                    >
                        {profilePhoto ?
                            (
                                <Image
                                    source={{ uri: profilePhoto }}
                                    style={styles.profileImage}
                                />
                            ) :
                            (
                                <FontAwesome6Icon name="user-circle" size={25} />
                            )
                        }

                    </TouchableOpacity>
                ),
            })}
        >
            <Drawer.Screen
                name="Home"
                component={Home}
                options={{
                    headerShown: true,
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
                }}
            />
            <Drawer.Screen
                name="Post"
                component={Post}
                options={{
                    headerShown: true,
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
                }}
            />
            <Drawer.Screen
                name="Story"
                component={Story}
                options={{
                    headerShown: true,
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
                }}
            />
            <Drawer.Screen
                name="Tracker"
                component={Tracker}
                options={{
                    headerShown: true,
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
                }}
            />
            <Drawer.Screen
                name="Product"
                component={Product}
                options={{
                    headerShown: true,
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
                }}
            />
            <Drawer.Screen
                name="Profile"
                component={Profile}
                options={{
                    headerShown: true,
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
                }}
            />
        </Drawer.Navigator>
    );
}

const RootNavigation = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const username = useSelector(selectUser);
    const isVerified = useSelector(selectIsVerified);
    const authenticatedUser = username && isVerified;

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
                    <Stack.Screen name="Home" component={DrawerNavigation} options={{ headerShown: false }} />
                    <Stack.Screen name="Tracker" component={DrawerNavigation} options={{ headerShown: false }} />
                    <Stack.Screen name="Post" component={DrawerNavigation} options={{ headerShown: false }} />
                    <Stack.Screen name="Product" component={DrawerNavigation} options={{ headerShown: false }} />
                    <Stack.Screen name="Story" component={DrawerNavigation} options={{ headerShown: false }} />
                    <Stack.Screen name="Profile" component={DrawerNavigation} options={{ headerShown: false }} />
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

const styles = StyleSheet.create({
    logoutButton: {
        flexDirection: "row",
        alignItems: "center",
        padding: 15,
        borderTopWidth: 1,
        borderColor: "#ccc",
    },
    logoutText: {
        marginLeft: 10,
        fontSize: 16,
        color: "black",
    },
    profileImage: {
        width: 30,
        height: 30,
        borderRadius: 25,
    },
});


export default RootNavigation;
