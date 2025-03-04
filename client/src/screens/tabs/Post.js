import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Animated } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '../../redux/features/auth/authSlice';
import client from '../../lib/axios';
import * as SecureStore from 'expo-secure-store';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

const Post = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const loading = useSelector((state) => state.auth.loading);
    const [uploadedPhoto, setPostPhoto] = useState(null);
    const [caption, setCaption] = useState('');
    const drawerY = new Animated.Value(1000); // Drawer Y position for animation

    const [isAnimationComplete, setAnimationComplete] = useState(false);

    useEffect(() => {
        Animated.timing(drawerY, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
        }).start(() => setAnimationComplete(true));
    }, []);

    const handleSelectPhoto = async () => {
        try {
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
                setPostPhoto(selectedImageUri);

                const uploadResponse = await uploadToCloudinary(selectedImageUri);
                if (uploadResponse?.secure_url) {
                    console.log('Uploaded Image URL:', uploadResponse.secure_url);
                    setPostPhoto(uploadResponse.secure_url);
                } else {
                    throw new Error('Upload failed or no secure_url returned');
                }
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                position: 'top', // Ensures the toast is in the center of the screen
                text1: 'Error',
                text2: 'Failed to select or upload the image.',
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

    const uploadToCloudinary = async (uri) => {
        try {
            const formData = new FormData();
            formData.append('file', {
                uri: uri,
                type: 'image/jpeg',
                name: 'post_picture.jpg',
            });
            formData.append('upload_preset', 'post_pictures');
            formData.append('unsigned', 'true');

            const response = await fetch(`https://api.cloudinary.com/v1_1/cloud/image/upload`, {
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
                position: 'top', // Ensures the toast is in the center of the screen
                text1: 'Cloudinary Error',
                text2: 'Failed to upload the post image',
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

    const handleSavePost = async () => {
        try {
            dispatch(setLoading(true));
            const token = await SecureStore.getItemAsync('authToken');
            const { data } = await client.post(
                '/post/add-post',
                { uploadedPhoto, caption },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            dispatch(setLoading(false));
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
            navigation.navigate('Home')
        } catch (error) {
            dispatch(setLoading(false));
            Toast.show({
                type: 'error',
                position: 'top', // Ensures the toast is in the center of the screen
                text1: 'Server Error',
                text2: 'Failed to save post changes',
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
            //Alert.alert('Error', error.response?.data?.message || 'Failed to save post changes');
        }
    };

    const handleBack = () => {
        navigation.navigate('Home');
    };

    return (
        <View style={styles.container}>
            {/* Animated drawer */}
            <Animated.View style={[styles.drawer, { transform: [{ translateY: drawerY }] }]}>
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    {/* Back Button */}
                    <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                        <FontAwesome5 name="times" size={30} color="white" />
                    </TouchableOpacity>

                    {/* Post Button */}
                    <TouchableOpacity onPress={handleSavePost} style={styles.postButton}>
                        <Text style={styles.postButtonText}>{loading ? 'Saving...' : 'Post Now'}</Text>
                    </TouchableOpacity>

                    {/* Caption Input */}
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Write a short caption..."
                        value={caption}
                        onChangeText={setCaption}
                        multiline
                    />

                    {/* Photo Picker */}
                    <View style={styles.photoPicker}>
                        <TouchableOpacity onPress={handleSelectPhoto} style={styles.iconButton}>
                            <FontAwesome5 name="image" size={30} color="gray" />
                            <Text style={styles.iconLabel}>Gallery</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleSelectPhoto} style={styles.iconButton}>
                            <FontAwesome5 name="camera" size={30} color="gray" />
                            <Text style={styles.iconLabel}>Camera</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Selected Photo */}
                    {uploadedPhoto ? (
                        <View style={styles.selectedPhotoContainer}>
                            <Image
                                source={{ uri: uploadedPhoto }}
                                style={styles.selectedPhoto}
                                resizeMode="contain"
                                onError={(error) =>
                                    console.error('Image failed to load:', error.nativeEvent.error)
                                }
                            />
                        </View>
                    ) : (
                        <Text>No Image Selected</Text>
                    )}
                </ScrollView>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    drawer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        height: '90%',
    },
    scrollContainer: {},
    backButton: {
        position: 'absolute',
        top: 20,
        left: 0,
        backgroundColor: '#812F21',
        padding: 10,
        borderRadius: 30,
        zIndex: 10,
    },
    postButton: {
        position: 'absolute',
        top: 20,
        right: 0,
        backgroundColor: '#812F21',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 30,
        zIndex: 10,
    },
    postButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    captionHeading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#6200ea',
    },
    input: {
        width: '100%',
        marginTop: 50,
        fontSize: 16,
        color: '#333',
    },
    textArea: {
        height: 120,
    },
    photoPicker: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 20,
    },
    iconButton: {
        alignItems: 'center',
    },
    iconLabel: {
        fontSize: 14,
        color: 'gray',
        marginTop: 5,
    },
    selectedPhotoContainer: {
        width: '100%',
        marginBottom: 20,
        alignItems: 'center',
    },
    selectedPhoto: {
        width: 250,
        height: 250,
        borderRadius: 15,
        marginBottom: 15,
    },
});

export default Post;
