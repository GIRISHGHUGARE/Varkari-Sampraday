import React, { useState } from "react";
import { View, Text, Image, ScrollView, Dimensions, ImageBackground } from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { BlurView } from 'expo-blur';
import InputBox from "../../components/forms/InputBox";
import SubmitButton from "../../components/forms/SubmitButton";
import client from "../../lib/axios";
import { setLoading, setError } from "../../redux/features/auth/authSlice";
import { SafeAreaView } from "react-native-safe-area-context";

const ForgotPassword = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const dispatch = useDispatch();
    const loading = useSelector(state => state.auth.loading);
    const navigation = useNavigation();

    const { height } = Dimensions.get("window");
    const imageHeight = height * 0.3;

    const showToast = (type, text1, text2) => {
        Toast.show({
            type,
            position: type === 'error' ? 'bottom' : 'top',
            text1,
            text2,
            visibilityTime: 3000,
            autoHide: true,
            topOffset: 50,
            bottomOffset: 40,
            style: {
                padding: 10,
                borderRadius: 10,
                maxWidth: '80%',
                alignSelf: 'center',
            },
            text1Style: {
                fontSize: 16,
                fontWeight: 'bold',
                color: '#000',
            },
            text2Style: {
                fontSize: 14,
                color: '#000',
                lineHeight: 20,
            },
        });
    };

    const handleEmailSubmit = async () => {
        if (!email) return showToast('error', 'Missing Email', 'Please enter your email');

        dispatch(setLoading(true));
        try {
            const { data } = await client.post("/auth/forgot-password", { email });
            showToast('success', 'OTP Sent', data.message);
            setStep(2);
        } catch (err) {
            showToast('error', 'Failed', err.response?.data?.message || "Something went wrong");
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleOtpSubmit = async () => {
        if (!otp || otp.length !== 4) {
            return showToast('error', 'Invalid OTP', 'Please enter the 4-digit code');
        }

        dispatch(setLoading(true));
        try {
            const { data } = await client.post("/auth/otp-reset-password", { email, otp }); // OR do it directly in reset-password
            showToast('success', 'Verified', 'OTP verified successfully');
            setStep(3);
        } catch (err) {
            showToast('error', 'OTP Error', err.response?.data?.message || "Invalid or expired OTP");
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handlePasswordReset = async () => {
        if (!newPassword || !confirmPassword) {
            return showToast('error', 'Missing Fields', 'Please fill in both password fields');
        }
        if (newPassword !== confirmPassword) {
            return showToast('error', 'Mismatch', 'Passwords do not match');
        }

        dispatch(setLoading(true));
        try {
            const { data } = await client.post("/auth/reset-password", {
                email,
                newPassword,
            });
            showToast('success', 'Success', 'Password reset successfully');
            navigation.navigate("Login");
        } catch (err) {
            showToast('error', 'Reset Failed', err.response?.data?.message || "Try again");
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
                            height: imageHeight,
                        }}
                    />
                    <ImageBackground
                        source={require('../../../assets/Background.png')}
                        style={{
                            width: '100%',
                            height: "100%",
                            borderRadius: 20,
                            backgroundColor: "black",
                            overflow: "hidden",
                            marginTop: -30
                        }}
                    >
                        <BlurView
                            className="p-8"
                            intensity={10}
                            style={{
                                flex: 1,
                                overflow: "hidden",
                                borderRadius: 20,
                                marginTop: -30,
                                marginBottom: 0,
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

                            <View className="mt-4">
                                {step === 1 && (
                                    <>
                                        <InputBox
                                            inputTitle="Email"
                                            value={email}
                                            setValue={setEmail}
                                            iconStart="envelope"
                                        />
                                        <SubmitButton
                                            btnTitle="Send OTP"
                                            loading={loading}
                                            handleSubmit={handleEmailSubmit}
                                        />
                                    </>
                                )}

                                {step === 2 && (
                                    <>
                                        <InputBox
                                            inputTitle="Enter OTP"
                                            value={otp}
                                            setValue={setOtp}
                                            iconStart="key"
                                            keyboardType="numeric"
                                            maxLength={4}
                                        />
                                        <SubmitButton
                                            btnTitle="Verify OTP"
                                            loading={loading}
                                            handleSubmit={handleOtpSubmit}
                                        />
                                    </>
                                )}

                                {step === 3 && (
                                    <>
                                        <InputBox
                                            inputTitle="New Password"
                                            value={newPassword}
                                            setValue={setNewPassword}
                                            iconStart="key"
                                            secureTextEntry
                                            iconEnd="eye-slash"
                                        />
                                        <InputBox
                                            inputTitle="Confirm Password"
                                            value={confirmPassword}
                                            setValue={setConfirmPassword}
                                            iconStart="key"
                                            secureTextEntry
                                            iconEnd="eye-slash"
                                        />
                                        <SubmitButton
                                            btnTitle="Reset Password"
                                            loading={loading}
                                            handleSubmit={handlePasswordReset}
                                        />
                                    </>
                                )}
                            </View>
                        </BlurView>
                    </ImageBackground>
                </View>
            </ScrollView>
            <Toast />
        </SafeAreaView>
    );
};

export default ForgotPassword;
