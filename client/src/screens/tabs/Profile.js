import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    TextInput,
    Button,
    StyleSheet,
    Alert,
    TouchableOpacity,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import client from '../../lib/axios';
import { useDispatch, useSelector } from 'react-redux';
import { login, selectUserSummary, selectUser, setLoading } from '../../redux/features/auth/authSlice';

const Profile = () => {
    const dispatch = useDispatch();

    // Fetch data from Redux store
    const user = useSelector(selectUser);
    const userSummary = useSelector(selectUserSummary);
    const loading = useSelector((state) => state.auth.loading);

    // Local state
    const [profilePhoto, setProfilePhoto] = useState(null); // For uploaded photo
    const [username, setUsername] = useState(''); // Username state
    const [summary, setSummary] = useState(''); // Summary state

    // Initialize username and summary with values from Redux store
    useEffect(() => {
        if (user) {
            setUsername(user || ''); // Set username from Redux
        }
        if (userSummary) {
            setSummary(userSummary || ''); // Set summary from Redux
        }
    }, [user, userSummary]);

    // Handle profile photo selection
    const handleSelectPhoto = async () => {
        // Request permission to access media library
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted) {
            Alert.alert('Permission required', 'We need access to your media library to upload a profile picture.');
            return;
        }

        // Open image picker
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1], // Crop to square aspect ratio
            quality: 1, // Image quality (0 to 1)
        });

        if (!result.canceled) {
            setProfilePhoto(result.assets[0].uri); // Save selected image URI
        }
    };

    // Handle saving profile changes
    const handleSaveProfile = async () => {
        try {
            dispatch(setLoading(true));
            const { data } = await client.put('/auth/update-user', {
                username,
                summary,
            });

            dispatch(setLoading(false));
            // Update Redux store with updated user information
            dispatch(login(data.user)); // Dispatch updated user data to Redux store
            Alert.alert('Success', data.message);
        } catch (error) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to save profile changes');
            dispatch(setLoading(false));
            console.log(error);
        }
    };

    return (
        <View style={styles.container}>
            {/* Profile Picture */}
            <TouchableOpacity onPress={handleSelectPhoto} style={styles.imageContainer}>
                {profilePhoto ? (
                    <Image source={{ uri: profilePhoto }} style={styles.profileImage} />
                ) : (
                    <View style={styles.placeholder}>
                        <Text style={styles.placeholderText}>Upload Photo</Text>
                    </View>
                )}
            </TouchableOpacity>

            {/* Username Input */}
            <TextInput
                style={styles.input}
                placeholder="Enter your username"
                value={username} // Show initial username from Redux store
                onChangeText={setUsername} // Update username state
            />

            {/* Summary Input */}
            <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Write a short summary about yourself"
                value={summary} // Show initial summary from Redux store
                onChangeText={setSummary} // Update summary state
                multiline
            />

            {/* Save Button */}
            <Button
                title={loading ? 'Saving...' : 'Save Profile'}
                onPress={handleSaveProfile}
                disabled={loading} // Disable button while saving
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    imageContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 1,
        borderColor: '#ccc',
        overflow: 'hidden',
        marginBottom: 20,
    },
    profileImage: {
        width: '100%',
        height: '100%',
    },
    placeholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    placeholderText: {
        color: '#999',
    },
    input: {
        width: '100%',
        padding: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        marginBottom: 15,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
});

export default Profile;
