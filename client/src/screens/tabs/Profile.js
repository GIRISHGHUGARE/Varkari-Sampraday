import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, Button, StyleSheet, Alert, TouchableOpacity, ScrollView, Modal, RefreshControl } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import { login, selectUserSummary, selectUser, setLoading, selectUserProfilePhoto } from '../../redux/features/auth/authSlice';
import client from '../../lib/axios';
import * as SecureStore from 'expo-secure-store';
import { MaterialIcons } from '@expo/vector-icons';
import PostCard from '../../components/cards/PostCard';
import { useNavigation } from '@react-navigation/native';  // For navigation to "All Posts" screen
import { fetchUserPosts } from '../../redux/features/post/userPostSlice';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import Toast from 'react-native-toast-message';


const Profile = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();

    // Fetch data from Redux store
    const user = useSelector(selectUser);
    const userProfilePhoto = useSelector(selectUserProfilePhoto);
    const userSummary = useSelector(selectUserSummary);
    const loading = useSelector((state) => state.auth.loading);

    // Local state
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [username, setUsername] = useState('');
    const [summary, setSummary] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const posts = useSelector((state) => state.userpost);
    const recentPost = posts.post.length > 0 ? posts.post[0] : null;
    const [refreshing, setRefreshing] = useState(false);
    useEffect(() => {
        dispatch(fetchUserPosts());
    }, [dispatch]);

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

    useEffect(() => {
        if (user) {
            setUsername(user || '');
        }
        if (userSummary) {
            setSummary(userSummary || '');
        }
        if (userProfilePhoto) {
            setProfilePhoto(userProfilePhoto);
        }
    }, [user, userSummary, userProfilePhoto]);

    const handleSelectPhoto = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted) {
            Alert.alert('Permission required', 'We need access to your media library to upload a profile picture.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            const selectedImageUri = result.assets[0].uri;
            setProfilePhoto(selectedImageUri);

            const uploadResponse = await uploadToCloudinary(selectedImageUri);
            if (uploadResponse) {
                setProfilePhoto(uploadResponse.secure_url || "profile_Photo");
            }
        }
    };

    const uploadToCloudinary = async (uri) => {
        try {
            const formData = new FormData();
            formData.append('file', {
                uri: uri,
                type: 'image/jpeg',
                name: 'profile_picture.jpg',
            });
            formData.append('upload_preset', 'profile_pictures');
            formData.append('unsigned', 'true');

            const response = await fetch(`https://api.cloudinary.com/v1_1/dtxcatfdq/image/upload`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.secure_url) {
                return data;
            } else {
                throw new Error('Failed to upload image');
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                position: 'Top', // Ensures the toast is in the center of the screen
                text1: 'Cloudinary Error',
                text2: 'Failed to upload the profile image',
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
            //Alert.alert('Error', 'Failed to upload the profile image');
        }
    };

    const handleSaveProfile = async () => {
        try {
            dispatch(setLoading(true));
            const token = await SecureStore.getItemAsync('authToken');
            const { data } = await client.put(
                '/auth/update-user',
                { username, profilePhoto, summary },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            dispatch(setLoading(false));
            dispatch(login(data.user));
            Toast.show({
                type: 'success',
                position: 'top', // top, bottom, or center
                text1: "Success",
                text2: data.message,
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
            //Alert.alert('Success', data.message);
            setModalVisible(false);  // Close the modal after saving
        } catch (error) {
            Toast.show({
                type: 'error',
                position: 'Top', // Ensures the toast is in the center of the screen
                text1: 'Server Error',
                text2: 'Failed to save profile changes',
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
            //Alert.alert('Error', error.response?.data?.message || 'Failed to save profile changes');
            dispatch(setLoading(false));
        }
    };
    const handleRefresh = async () => {
        setRefreshing(true);
        await dispatch(fetchUserPosts());
        setRefreshing(false);
    };
    // Handle navigation to all posts page
    const handleShowAllPosts = () => {
        navigation.navigate('AllPosts'); // Navigate to the "AllPosts" screen
    };

    return (
        <ScrollView contentContainerStyle={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}>
            <View style={styles.headerSection}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleSelectPhoto} style={styles.imageContainer}>
                        {profilePhoto ? (
                            <Image source={{ uri: profilePhoto }} style={styles.profileImage} />
                        ) : (
                            <View style={styles.placeholder}>
                                <Text style={styles.placeholderText}>Upload Photo</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                    <View style={styles.profileInfo}>
                        <TouchableOpacity onPress={() => setModalVisible(true)}>
                            <MaterialIcons name="edit" size={24} color="#0073b1" style={styles.editIcon} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ paddingTop: 20 }}>
                    <Text style={styles.username}>{username}</Text>
                    <Text style={styles.summaryLabel}>{summary}</Text>
                </View>
            </View>


            {/* Activity Section */}
            <View style={styles.activitySection}>
                <Text style={styles.activityTitle}>Activity</Text>
                <PostCard posts={posts} myPostScreen={true} />
                {/* <TouchableOpacity onPress={handleShowAllPosts}>
                    <View style={styles.showAllPostsButton}>
                        <Text style={styles.showAllPostsButtonText}>Show All Posts</Text>
                        <FontAwesome6Icon name="arrow-right" size={18} color="gray" />
                    </View>
                </TouchableOpacity> */}
            </View>

            {/* Edit Profile Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Edit Profile</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Enter your username"
                            value={username}
                            onChangeText={setUsername}
                        />
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Write a short summary about yourself"
                            value={summary}
                            onChangeText={setSummary}
                            multiline
                        />

                        <View style={styles.modalButtons}>
                            <Button title="Cancel" onPress={() => setModalVisible(false)} />
                            <Button
                                title={loading ? 'Saving...' : 'Save Profile'}
                                onPress={handleSaveProfile}
                                disabled={loading}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerSection: {
        padding: 10,
        backgroundColor: '#ffffff',
    },
    imageContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 2,
        borderColor: '#0073b1',
        overflow: 'hidden',
        marginRight: 20,
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
    profileInfo: {
        flex: 1,
    },
    username: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    summaryLabel: {
        fontSize: 14,
        color: '#0073b1',
        marginTop: 5,
    },
    editIcon: {
        alignSelf: 'flex-end',
    },
    activitySection: {
        backgroundColor: '#ffffff',
        marginTop: 10,
    },
    activityTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginLeft: 10,
        marginTop: 10
    },
    input: {
        width: '100%',
        padding: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        marginBottom: 15,
        backgroundColor: '#fff',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '80%',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalButtons: {
        marginTop: 20,
    },
    showAllPostsButton: {
        fontSize: 22,
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: "center",
        borderTopWidth: 1,
        height: 50,
        borderTopColor: "gray"
    },
    showAllPostsButtonText: {
        fontSize: 18,
        marginRight: 10,
        color: "gray"
    },
});

export default Profile;
