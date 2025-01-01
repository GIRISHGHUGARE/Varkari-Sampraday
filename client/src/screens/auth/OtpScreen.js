import React, { useState, useRef, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useNavigation } from '@react-navigation/native';
import SubmitButton from "../../components/forms/SubmitButton"; // Assuming SubmitButton is already created
import { selectUserEmail } from "../../redux/features/auth/authSlice";
import axios from "axios";
import { useDispatch, useSelector } from 'react-redux';
import * as SecureStore from 'expo-secure-store';
const OtpScreen = () => {
    const email = useSelector(selectUserEmail);
    const [otp, setOtp] = useState(["", "", "", ""]); // State to store OTP digits
    const [loading, setLoading] = useState(false);
    const inputRefs = useRef([]);
    const navigation = useNavigation();

    // Handle OTP input change
    const handleOtpChange = (value, index) => {
        const newOtp = [...otp];
        if (value.length > 1) {
            const pastedOtp = value.slice(0, 4).split("");
            for (let i = 0; i < 4; i++) {
                newOtp[i] = pastedOtp[i] || "";
            }
            setOtp(newOtp);

            // Focus on the last non-empty input or the first empty one
            const lastFilledIndex = newOtp.findLastIndex((digit) => digit !== "");
            const focusIndex = lastFilledIndex < 3 ? lastFilledIndex + 1 : 3;
            inputRefs.current[focusIndex].focus();
        } else {
            newOtp[index] = value;
            setOtp(newOtp);

            // Move focus to the next input field if value is entered
            if (value && index < 3) {
                inputRefs.current[index + 1].focus();
            }
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    // Auto submit when all fields are filled
    useEffect(() => {
        if (otp.every((digit) => digit !== "")) {
            handleVerifyOtp();
        }
    }, [otp]);

    // Handle OTP verification
    const handleVerifyOtp = async () => {
        const otpString = otp.join('');
        if (otpString.length !== 4) {
            Alert.alert("Error", "Please enter a valid 4-digit OTP");
            return;
        }

        setLoading(true);
        try {
            const token = await SecureStore.getItemAsync('authToken');
            // Replace with actual API call for OTP verification
            const response = await axios.post("http://192.168.0.114:8080/api/v1/auth/verify-email",
                { otp: otpString }, // Data payload
                { headers: { Authorization: `Bearer ${token}` } } // Headers
            );
            if (response.data.success) {
                Alert.alert("Success", "OTP verified successfully! Please login!");
                navigation.navigate('Login'); // Redirect to home screen or wherever you'd like
            } else {
                Alert.alert("Error", "Invalid OTP. Please try again.");
            }
        } catch (error) {
            Alert.alert("Error", error.response?.data?.message || "An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Focus on the first input when the component mounts
    useEffect(() => {
        inputRefs.current[0].focus();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Enter OTP</Text>
            <Text style={styles.subtitle}>We have sent a 4-digit OTP to your email: {email}</Text>

            <View style={styles.otpContainer}>
                {/* Render 4 OTP input fields */}
                {otp.map((digit, index) => (
                    <TextInput
                        key={index}
                        style={styles.otpInput}
                        keyboardType="numeric"
                        maxLength={1}
                        value={digit}
                        onChangeText={(value) => handleOtpChange(value, index)}
                        onKeyPress={(e) => handleKeyDown(index, e)}
                        ref={(ref) => (inputRefs.current[index] = ref)}
                        autoFocus={index === 0}
                    />
                ))}
            </View>

            {/* Verify OTP Button */}
            <SubmitButton
                btnTitle="Verify OTP"
                loading={loading}
                handleSubmit={handleVerifyOtp}
            />

            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.resendLink}>
                <Text style={styles.resendText}>Resend OTP</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1F2937', // Dark background similar to the other screens
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        fontFamily: 'Poppins_600SemiBold',
        color: 'white',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#A4A4A4',
        textAlign: 'center',
        marginBottom: 30,
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        marginBottom: 40,
    },
    otpInput: {
        width: 60,
        height: 60,
        borderColor: '#4B5563',
        borderWidth: 1,
        borderRadius: 10,
        textAlign: 'center',
        fontSize: 24,
        color: 'white',
        backgroundColor: '#6B7280',
    },
    resendLink: {
        marginTop: 20,
    },
    resendText: {
        color: '#F87171',
        fontSize: 16,
        fontFamily: 'Poppins_400Regular',
    },
});

export default OtpScreen;
