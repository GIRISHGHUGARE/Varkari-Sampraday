import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Animated, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import client from '../../lib/axios';
import moment from 'moment';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import RootTab from '../../navigation/Tabs/RootTab';

const Story = () => {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.7)).current;

    useEffect(() => {
        fetchStories();
    }, []);

    const fetchStories = async () => {
        try {
            const token = await SecureStore.getItemAsync('authToken');
            const response = await client.get('/story/get-story', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setStories(response.data.story);
            setLoading(false);
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }).start();
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 3,
                tension: 150,
                useNativeDriver: true,
            }).start();
        } catch (error) {
            console.error('Error fetching stories:', error);
            setLoading(false);
        }
    };

    const renderStoryCard = ({ item }) => (
        <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
            <TouchableOpacity onPress={() => navigation.navigate('StoryDetail', { story: item })}>
                <Image source={{ uri: item.storyPhoto }} style={styles.image} />
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.preview} numberOfLines={3}>{item.content}</Text>
            </TouchableOpacity>
        </Animated.View>
    );
    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#007bff" style={styles.loader} />
            ) : (
                <FlatList
                    data={stories}
                    keyExtractor={item => item._id.toString()}
                    renderItem={renderStoryCard}
                />
            )}
            <RootTab />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#000',
    },
    preview: {
        fontSize: 14,
        color: '#333',
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default Story;