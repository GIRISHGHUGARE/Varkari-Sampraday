import React, { useState } from "react";
import { View, Text, Alert, ImageBackground, Image, ScrollView, Dimensions } from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import { login, setLoading, setError } from "../../redux/features/auth/authSlice.js";
import InputBox from "../../components/forms/InputBox.js";
import SubmitButton from "../../components/forms/SubmitButton";
import axios from "axios";
import { BlurView } from 'expo-blur';
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import client from "../../lib/axios.js";
import Toast from 'react-native-toast-message';

const SignUp = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Access loading and error states from Redux store
    const loading = useSelector((state) => state.auth.loading);
    const error = useSelector((state) => state.auth.error);

    // Get the screen height
    const { height } = Dimensions.get('window');

    // Calculate the image height (3 parts of the screen height, 7 parts for other content)
    const imageHeight = height * 0.3;  // 30% of the screen height
    const contentHeight = height * 0.7; // The remaining 70% for the content

    // Handle username/password login
    const handleSubmit = async () => {
        dispatch(setLoading(true)); // Set loading to true
        dispatch(setError(null)); // Clear any previous errors
        try {
            if (!username || !password) {
                Toast.show({
                    type: 'error',
                    position: 'bottom', // top, bottom, or center
                    text1: 'Validation Error',
                    text2: 'Please fill in all fields.',
                    visibilityTime: 3000, // Duration in milliseconds
                    autoHide: true, // Automatically hides after visibilityTime
                    topOffset: 0, // Distance from top (when position is top)
                    bottomOffset: 40, // Distance from bottom (when position is bottom)
                    style: {
                        padding: 10,
                        backgroundColor: 'red',
                        maxWidth: '80%', // Control max width
                        borderRadius: 10,
                    },
                    text1Style: {
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: '#000',
                    },
                    text2Style: {
                        fontSize: 14,
                        color: '#000',
                        flexWrap: 'wrap', // Allow text to wrap into multiple lines
                        lineHeight: 20,   // Adjust line height for readability
                        maxWidth: '80%',  // Control the max width of the toast
                    },
                });
                //Alert.alert("Validation Error", "Please fill in all fields.");
                return;
            }
            const { data } = await client.post("/auth/register", { username, email, password });
            await SecureStore.setItemAsync('authToken', data.token);
            dispatch(login(data.user));
            Toast.show({
                type: 'success',
                position: 'top', // top, bottom, or center
                text1: data.message,
                text2: "Welcome to Varkari Sampraday !!",
                visibilityTime: 3000, // Duration in milliseconds
                autoHide: true, // Automatically hides after visibilityTime
                topOffset: 110, // No top offset, as it's already centered
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
            //Alert.alert("Success", data.message);
            navigation.navigate('OtpScreen');
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Register failed"));
            Toast.show({
                type: 'error',
                position: 'bottom', // top, bottom, or center
                text1: 'Username should be at least 3 characters',
                text2: 'Password must be at least 6 characters',
                visibilityTime: 3000, // Duration in milliseconds
                autoHide: true, // Automatically hides after visibilityTime
                topOffset: 0, // Distance from top (when position is top)
                bottomOffset: 40, // Distance from bottom (when position is bottom)
                style: {
                    padding: 10,
                    backgroundColor: 'red',
                    maxWidth: '80%', // Control max width
                    borderRadius: 10,
                },
                text1Style: {
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: '#000',
                },
                text2Style: {
                    fontSize: 14,
                    color: '#000',
                    flexWrap: 'wrap', // Allow text to wrap into multiple lines
                    lineHeight: 20,   // Adjust line height for readability
                    maxWidth: '80%',  // Control the max width of the toast
                },
            });
            //Alert.alert("Register Failed", error.response?.data?.message || "Register failed");
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={{ flex: 1 }}>
                    <Image
                        source={require('../../../assets/Mauli1.png')}
                        style={{
                            width: '100%',
                            height: imageHeight,  // Dynamically set height based on 3:7 ratio
                        }}
                    />
                    {/* ImageBackground with content */}
                    <ImageBackground
                        source={require('../../../assets/Background.png')}
                        style={{
                            width: '100%',
                            height: "100%",  // Ensure it fills the remaining content space
                            borderRadius: 20,
                            backgroundColor: "black", // Make sure it doesn't create extra white space
                            overflow: "hidden", // Prevent any overflow
                            marginTop: -80
                        }}
                    >
                        {/* BlurView with slight overlap */}
                        <BlurView
                            className="p-8"
                            intensity={10}
                            style={{
                                flex: 1,
                                overflow: "hidden",
                                borderRadius: 20,
                                marginTop: -30, // Apply negative margin to overlap the background
                                marginBottom: 0, // Ensure the BlurView's bottom is flush with the content
                            }}
                        >
                            <Image
                                source={require('../../../assets/iconbg.png')}
                                style={{
                                    width: 100,
                                    height: 100,
                                    alignSelf: "center",
                                    marginTop: 20
                                }}
                            />
                            {/* <Text className="color-white text-center text-4xl mt-10 font-bold font-poppins">Jai Hari Mauli !</Text> */}
                            <View className="mt-4">
                                <InputBox
                                    inputTitle="Username"
                                    value={username}
                                    setValue={setUsername}
                                    iconStart="user"
                                />
                                <InputBox
                                    inputTitle="Email"
                                    value={email}
                                    setValue={setEmail}
                                    iconStart="envelope"
                                />
                                <InputBox
                                    inputTitle="Password"
                                    secureTextEntry={true}
                                    value={password}
                                    setValue={setPassword}
                                    iconStart="key"
                                    iconEnd="eye-slash"
                                />

                                <Text className="color-[#A4A4A4] text-center mt-4 mb-4 font-poppins">
                                    Already have an account?{" "}
                                    <Text className="text-red-500 font-bold font-poppins" onPress={() => navigation.navigate('Login')}>
                                        Sign in
                                    </Text>
                                </Text>

                                <SubmitButton
                                    btnTitle="SignUp"
                                    loading={loading}
                                    handleSubmit={handleSubmit}
                                />
                            </View>

                        </BlurView>
                    </ImageBackground>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default SignUp