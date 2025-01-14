import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, Button, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import { login, selectUserSummary, selectUser, setLoading, selectUserProfilePhoto } from '../../redux/features/auth/authSlice';
import client from '../../lib/axios';
import * as SecureStore from 'expo-secure-store';
import RootTab from '../../navigation/Tabs/RootTab';
const Post = () => {
    const dispatch = useDispatch();

    // Fetch data from Redux store
    const user = useSelector(selectUser);
    const userProfilePhoto = useSelector(selectUserProfilePhoto);
    const userSummary = useSelector(selectUserSummary);
    const loading = useSelector((state) => state.auth.loading);

    // Local state
    const [profilePhoto, setProfilePhoto] = useState(null); // For uploaded photo
    const [username, setUsername] = useState(''); // Username state
    const [summary, setSummary] = useState(''); // Summary state
    return (
        <View className="flex-1 bg-white">
            <ScrollView>
                <Text className="flex-1 text-center bg-red-400">Post</Text>
            </ScrollView>
            <RootTab />
        </View>
    )
}

export default Post