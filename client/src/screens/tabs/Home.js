import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl, TextInput, FlatList, TouchableOpacity, Image, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import PostCard from '../../components/cards/PostCard';
import { fetchPosts } from '../../redux/features/post/postSlice';
import RootTab from '../../navigation/Tabs/RootTab';
import { useNavigation } from '@react-navigation/native';
import client from '../../lib/axios';
import * as SecureStore from 'expo-secure-store';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const Home = () => {
    const dispatch = useDispatch();
    const posts = useSelector((state) => state.post);
    const [refreshing, setRefreshing] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');
    const [users, setUsers] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        dispatch(fetchPosts());
    }, [dispatch]);

    const onRefresh = async () => {
        setRefreshing(true);
        await dispatch(fetchPosts());
        setRefreshing(false);
    };

    // Fetch users based on search query
    const handleSearch = async () => {
        if (searchQuery.trim() === '') {
            setUsers([]);
            return;
        }

        try {
            const token = await SecureStore.getItemAsync('authToken');
            const response = await client.post('auth/search-user', { username: searchQuery }, { headers: { Authorization: `Bearer ${token}` } });
            if (response.data.success) {
                setUsers(response.data.users);  // Set the returned users to the state
            }
        } catch (error) {
            console.error("Error searching users:", error);
        }
    };

    // Navigate to the user's profile
    const navigateToProfile = (userId) => {
        navigation.navigate('Profile', { userId });  // Pass userId to profile page
    };

    useEffect(() => {
        handleSearch(); // Initial search if needed
    }, [searchQuery]);

    return (
        <View style={styles.container}>

            {/* Search Bar */}
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <View style={styles.searchContainer}>
                    <FontAwesome5 name="search" style={styles.searchIcon} />
                    <TextInput
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholder="Search users..."
                        style={styles.searchInput}
                    />
                    {searchQuery ? (
                        <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearIcon}>
                            <FontAwesome5 name="times-circle" style={styles.clearIconText} />
                        </TouchableOpacity>
                    ) : null}
                </View>

                {/* Display Search Results */}
                {users.length > 0 && (
                    <FlatList
                        data={users}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.userItem}
                                onPress={() => navigateToProfile(item._id)}
                            >
                                {item.profilePhoto ? (
                                    <Image source={{ uri: item.profilePhoto }} style={styles.profileImage} />
                                ) : (
                                    <Text style={styles.profileImage}>?</Text>
                                )}
                                <Text style={styles.username}>{item.username}</Text>
                            </TouchableOpacity>
                        )}
                    />
                )}

                {/* Conditionally Render PostCards */}
                {!searchQuery.trim() && (
                    <PostCard posts={posts} myPostScreen={false} />
                )}
            </ScrollView>

            {/* Navigation Tab */}
            <RootTab />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f8f8",
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#ddd',
        margin: 10,
        paddingHorizontal: 15,
        paddingVertical: 5,
    },
    searchIcon: {
        fontSize: 20,
        color: '#bbb',
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        height: 40,
        fontSize: 16,
        color: '#333',
    },
    clearIcon: {
        paddingLeft: 10,
    },
    clearIconText: {
        fontSize: 20,
        color: '#bbb',
    },
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        textAlign: 'center',
        lineHeight: 40,
    },
    username: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Home;
