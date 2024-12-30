import React, { useState } from "react";
import { View, Text, Alert } from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import { login, setLoading, setError } from "../../redux/features/auth/authSlice.js"; // Import the Redux actions
import InputBox from "../../components/forms/InputBox.js";
import SubmitButton from "../../components/forms/SubmitButton";
import axios from "axios";
import { BlurView } from 'expo-blur'; // Import BlurView from expo-blur
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';

const Login = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch(); // Use Redux dispatch
    const [username, setUsername] = useState(""); // Change email to username
    const [password, setPassword] = useState("");

    // Access loading and error states from Redux store
    const loading = useSelector((state) => state.auth.loading);
    const error = useSelector((state) => state.auth.error);

    // Handle username/password login
    const handleSubmit = async () => {
        dispatch(setLoading(true)); // Set loading to true
        dispatch(setError(null)); // Clear any previous errors

        try {
            if (!username || !password) { // Check for username instead of email
                Alert.alert("Validation Error", "Please fill in all fields.");
                return;
            }
            const { data } = await axios.post("http://192.168.0.114:8080/api/v1/auth/login", { username, password }); // Use username in the request
            await SecureStore.setItemAsync('authToken', data.token); // Save token in SecureStore
            dispatch(login(data.user)); // Dispatch the action to update Redux store
            Alert.alert("Success", data.message);
            navigation.navigate('Home'); // Navigate to Home after successful login
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Login failed")); // Set error in Redux store
            Alert.alert("Login Failed", error.response?.data?.message || "Login failed");
        } finally {
            dispatch(setLoading(false)); // Set loading to false
        }
    };

    return (
        <SafeAreaView className="flex-1 justify-center items-center bg-black p-4">
            <BlurView
                className="w-full max-w-md rounded-lg p-6"
                intensity={150} // Adjust the intensity of the blur effect
                style={{ borderRadius: 10 }} // Ensure the blur view has rounded corners
            >
                <Text className="text-2xl font-bold text-center mb-6">Login</Text>

                <InputBox
                    inputTitle="USERNAME" // Change input title to "USERNAME"
                    value={username} // Use username state
                    setValue={setUsername} // Set username state
                    iconStart="user" // You can change the icon if needed
                />
                <InputBox
                    inputTitle="PASSWORD"
                    secureTextEntry={true}
                    value={password}
                    setValue={setPassword}
                    iconStart="lock"
                    iconEnd="eye-slash"
                />

                <Text className="text-black text-center mt-4 mb-4">
                    Don't have an account?{" "}
                    <Text className="text-red-600 font-bold" onPress={() => navigation.navigate('Register')}>
                        Register Now
                    </Text>
                </Text>

                <SubmitButton
                    btnTitle="Login"
                    loading={loading} // Use loading from Redux store
                    handleSubmit={handleSubmit}
                />
            </BlurView>
        </SafeAreaView>
    );
};

export default Login;