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
import client from '../../lib/axios.js';

const Login = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    // Access loading and error states from Redux store
    const loading = useSelector((state) => state.auth.loading);
    const error = useSelector((state) => state.auth.error);

    //
    const isVerified = useSelector((state) => state.auth.user.isVerified);

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
                Alert.alert("Validation Error", "Please fill in all fields.");
                return;
            }
            const { data } = await client.post("/auth/login", { username, password });
            await SecureStore.setItemAsync('authToken', data.token);
            dispatch(login(data.user));
            Alert.alert("Success", data.message);
            navigation.navigate('Home');
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Login failed"));
            Alert.alert("Login Failed", error.response?.data?.message || "Login failed");
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
                            marginTop: -30
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
                                source={require('../../../assets/icon.png')}
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
                                    inputTitle="Password"
                                    secureTextEntry={true}
                                    value={password}
                                    setValue={setPassword}
                                    iconStart="key"
                                    iconEnd="eye-slash"
                                />

                                <Text className="color-[#A4A4A4] text-center mt-4 mb-4 font-poppins">
                                    Don't have an account?{" "}
                                    <Text className="text-red-500 font-bold font-poppins" onPress={() => navigation.navigate('SignUp')}>
                                        Register Now
                                    </Text>
                                </Text>

                                <SubmitButton
                                    btnTitle="Login"
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
};

export default Login;
