import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Image, Animated } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { useSelector, useDispatch } from 'react-redux';
import * as SecureStore from 'expo-secure-store';
import { login, setLoading, setError } from '../redux/features/auth/authSlice.js';
import { selectUser, selectIsVerified } from '../redux/features/auth/authSlice.js';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import Toast from 'react-native-toast-message';

// File imports
import Home from "../screens/tabs/Home.js";
import Tracker from "../screens/tabs/Tracker.js";
import Post from "../screens/tabs/Post.js";
import Product from "../screens/tabs/Product.js";
import Profile from "../screens/tabs/Profile.js";
import Settings from "../screens/tabs/Settings.js";
import Login from "../screens/auth/Login.js";
import SignUp from "../screens/auth/SignUp.js";
import OtpScreen from '../screens/auth/OtpScreen.js';
import client from '../lib/axios.js';
import Story from '../screens/tabs/Story.js';
import Cart from '../screens/tabs/Cart.js';
import Payment from '../screens/tabs/Payment.js';
import StoryDetail from '../screens/tabs/StoryDetail.js';
import ForgotPassword from '../screens/auth/ForgotPassword.js';

// Create navigators
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();



const AnimatedTitle = ({ title }) => {
    const [letterAnimations, setLetterAnimations] = useState([]);

    useEffect(() => {
        const animations = title.split('').map(() => new Animated.Value(0)); // Initialize opacity for each letter
        setLetterAnimations(animations);

        // Creating the animation sequence for the letters to fade in one by one
        const animationsSequence = animations.map((anim, index) =>
            Animated.timing(anim, {
                toValue: 1,
                duration: 500,
                delay: 100 * index, // Delay between each letter
                useNativeDriver: true,
            })
        );

        // Looping the animation
        const loopAnimation = Animated.loop(
            Animated.stagger(100, animationsSequence) // Apply staggered animation
        );

        loopAnimation.start(); // Start the animation loop
    }, [title]);

    return (
        <View style={{ flexDirection: 'row' }}>
            {title.split('').map((letter, index) => (
                <Animated.Text
                    key={index}
                    style={{
                        opacity: letterAnimations[index],
                        fontSize: 24,
                        fontWeight: 'bold',
                        color: 'black',
                    }}
                >
                    {letter}
                </Animated.Text>
            ))}
        </View>
    );
};

// Access navigation from props
const CustomDrawerContent = (props) => {
    const { navigation } = props;
    const dispatch = useDispatch();

    const handleLogout = async () => {
        try {
            dispatch(login("")); // Clear login state
            await SecureStore.deleteItemAsync("authToken");
            const response = await client.delete("/auth/logout");
            Toast.show({
                type: 'success',
                position: 'bottom', // Ensures the toast is in the center of the screen
                text1: 'Success',
                text2: response.data.message,
                visibilityTime: 3000, // Duration in milliseconds
                autoHide: true, // Automatically hides after visibilityTime
                topOffset: 0, // No top offset, as it's already centered
                bottomOffset: 40, // No bottom offset, as it's already centered
                style: {
                    padding: 10,
                    maxWidth: '80%', // Control max width
                    borderRadius: 10,
                },
                text1Style: {
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: '#000', // Changed to white for better contrast
                },
                text2Style: {
                    fontSize: 14,
                    color: '#000', // Changed to white for better contrast
                    flexWrap: 'wrap', // Allow text to wrap into multiple lines
                    lineHeight: 20,   // Adjust line height for readability
                    maxWidth: '80%',  // Control the max width of the toast
                },
            });
            navigation.navigate("Login");
        } catch (error) {
            console.error("Error in logout", error);
            Toast.show({
                type: 'error',
                position: 'top', // Ensures the toast is in the center of the screen
                text1: 'Server Error',
                text2: 'Failed to logout',
                visibilityTime: 3000, // Duration in milliseconds
                autoHide: true, // Automatically hides after visibilityTime
                topOffset: 50, // No top offset, as it's already centered
                bottomOffset: 0, // No bottom offset, as it's already centered
                style: {
                    padding: 10,
                    maxWidth: '80%', // Control max width
                    borderRadius: 10,
                },
                text1Style: {
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: '#000', // Changed to white for better contrast
                },
                text2Style: {
                    fontSize: 14,
                    color: '#000', // Changed to white for better contrast
                    flexWrap: 'wrap', // Allow text to wrap into multiple lines
                    lineHeight: 20,   // Adjust line height for readability
                    maxWidth: '80%',  // Control the max width of the toast
                },
            });
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
    const navigation = useNavigation();
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
                    headerTitle: () => <AnimatedTitle title="Jai Hari Mauli !" />,
                    headerTitleAlign: "center",
                    headerRight: () => (
                        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: 'center' }}>
                            <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
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
                    headerTitle: "",
                    headerRight: () => (
                        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: 'center' }}>
                            <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
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
                    headerTitle: () => <AnimatedTitle title="Jai Hari Vitthal !" />,
                    headerTitleAlign: "center",
                    headerRight: () => (
                        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: 'center' }}>
                            <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
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
                    headerTitle: () => <AnimatedTitle title="Jai Hari Mauli !" />,
                    headerTitleAlign: "center",
                    headerRight: () => (
                        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: 'center' }}>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('Cart')} // Navigate to Cart screen when pressed
                            >
                                <MaterialIcons
                                    name="shopping-cart"
                                    style={{ fontSize: 25, color: "black", marginRight: 20 }}
                                />
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
                    headerTitle: () => <AnimatedTitle title="Ram Krishna Hari !" />,
                    headerTitleAlign: "center",
                    headerRight: () => (
                        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: 'center' }}>
                            <TouchableOpacity onPress={() => console.log('Settings pressed')}>
                                <MaterialIcons name="settings" style={{ fontSize: 25, color: "black", marginRight: 20 }} />
                            </TouchableOpacity>
                        </View>
                    ),
                }}
            />
            <Drawer.Screen
                name="Cart"
                component={Cart}
                options={{
                    headerShown: true,
                    headerTitle: () => <AnimatedTitle title="Ram Krishna Hari !" />,
                    headerTitleAlign: "center",
                    headerRight: () => (
                        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: 'center' }}>
                            <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
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
                    <Stack.Screen name="Post" component={Post} options={{ headerShown: false }} />
                    <Stack.Screen name="Product" component={DrawerNavigation} options={{ headerShown: false }} />
                    <Stack.Screen name="Story" component={DrawerNavigation} options={{ headerShown: false }} />
                    <Stack.Screen name="Profile" component={DrawerNavigation} options={{ headerShown: false }} />
                    <Stack.Screen name="StoryDetail" component={StoryDetail} options={{ headerShown: false }} />
                    <Stack.Screen name="Cart" component={Cart} options={{ headerShown: false }} />
                    <Stack.Screen name="Payment" component={Payment} options={{ headerShown: false }} />
                    <Stack.Screen name="Settings" component={Settings} options={{ headerShown: false }} />
                </>
            ) : (
                <>
                    <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
                    <Stack.Screen name="OtpScreen" component={OtpScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
                    <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: false }} />
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
