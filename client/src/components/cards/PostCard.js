import React, { useState } from 'react';
import { Text, View, StyleSheet, Alert, Image, TouchableOpacity, Modal } from 'react-native';
import moment from "moment";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import EditModal from './EditModal';
import client from '../../lib/axios';
import * as SecureStore from 'expo-secure-store';

const PostCard = ({ posts, myPostScreen }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [post, setPost] = useState({});
    const [menuVisible, setMenuVisible] = useState(false);
    const [currentPostId, setCurrentPostId] = useState(null);
    const navigation = useNavigation();

    const handleAlertDeletePost = (id) => {
        Alert.alert("Attention!", "Are you sure you want to delete the post?", [
            { text: "Cancel", onPress: () => console.log("Cancel button pressed") },
            { text: "Delete", onPress: () => handleDeletePost(id) },
        ]);
    };

    const handleDeletePost = async (id) => {
        try {
            const token = await SecureStore.getItemAsync('authToken'); // Fetch token securely
            const { data } = await client.delete(`/post/delete-post/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert(data?.message);
            navigation.push("Home");
        } catch (error) {
            console.error(error);
            alert("Error deleting the post.");
        }
    };

    const handleMenuToggle = (id) => {
        setMenuVisible((prev) => !prev);
        setCurrentPostId(id);
    };

    return (
        <>
            <View>
                {myPostScreen && (
                    <EditModal
                        modalVisible={modalVisible}
                        setModalVisible={setModalVisible}
                        post={post}
                    />
                )}
                {posts?.post.map((postItem, i) => (
                    <View style={styles.card} key={i}>
                        {/* User profile section */}
                        <View style={styles.userSection}>
                            <Image
                                source={{ uri: postItem.postedByProfile || 'https://via.placeholder.com/50' }}
                                style={styles.profileImage}
                            />
                            <View style={{ flex: 1 }}>
                                <Text style={styles.userName}>{postItem.postedByName}</Text>
                                <Text style={styles.date}>
                                    {moment(postItem.createdAt).format("DD/MM/YYYY")}
                                </Text>
                            </View>
                            {/* Vertical three dots menu */}
                            <TouchableOpacity onPress={() => handleMenuToggle(postItem._id)}>
                                <FontAwesome5 name="ellipsis-v" size={18} color="gray" />
                            </TouchableOpacity>
                        </View>

                        {/* Menu Options */}
                        {menuVisible && currentPostId === postItem._id && (
                            <View style={styles.menu}>
                                {myPostScreen ? (
                                    <>
                                        <TouchableOpacity
                                            onPress={() => {
                                                setPost(postItem);
                                                setModalVisible(true);
                                                setMenuVisible(false);
                                            }}
                                        >
                                            <Text style={styles.menuItem}>Edit</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => {
                                                setMenuVisible(false);
                                                handleAlertDeletePost(postItem._id);
                                            }}
                                        >
                                            <Text style={styles.menuItem}>Delete</Text>
                                        </TouchableOpacity>
                                    </>
                                ) : (
                                    <>
                                        <TouchableOpacity onPress={() => alert("Option 1")}>
                                            <Text style={styles.menuItem}>Option 1</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => alert("Option 2")}>
                                            <Text style={styles.menuItem}>Option 2</Text>
                                        </TouchableOpacity>
                                    </>
                                )}
                            </View>
                        )}

                        {/* Post details */}
                        <Text style={styles.caption}>{postItem.caption}</Text>
                        {postItem.uploadedPhoto && (
                            <Image
                                source={{ uri: postItem.uploadedPhoto }}
                                style={styles.postImage}
                                resizeMode="cover"
                            />
                        )}

                        {/* Action buttons */}
                        <View style={styles.actions}>
                            <TouchableOpacity onPress={() => console.log(`Liked post ${postItem._id}`)} style={styles.actionButton}>
                                <FontAwesome5 name="thumbs-up" size={20} color="blue" />
                                <Text style={styles.actionText}>Like</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => console.log(`Comment post ${postItem._id}`)} style={styles.actionButton}>
                                <FontAwesome5 name="comment" size={20} color="green" />
                                <Text style={styles.actionText}>Comment</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => console.log(`Share post ${postItem._id}`)} style={styles.actionButton}>
                                <FontAwesome5 name="share" size={20} color="purple" />
                                <Text style={styles.actionText}>Share</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    card: {
        margin: 10,
        padding: 15,
        backgroundColor: "#fff",
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    userSection: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    userName: {
        fontSize: 16,
        fontWeight: "bold",
    },
    date: {
        fontSize: 12,
        color: "gray",
    },
    caption: {
        fontSize: 16,
        marginVertical: 10,
    },
    postImage: {
        width: "100%",
        height: 300,
        borderRadius: 10,
        marginBottom: 10,
    },
    actions: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 10,
    },
    actionButton: {
        flexDirection: "row",
        alignItems: "center",
    },
    actionText: {
        marginLeft: 5,
        fontSize: 14,
    },
    menu: {
        position: "absolute",
        right: 10,
        top: 50,
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 10,
        elevation: 5,
        zIndex: 10
    },
    menuItem: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        fontSize: 16,
        color: "#333",
    },
});

export default PostCard;
