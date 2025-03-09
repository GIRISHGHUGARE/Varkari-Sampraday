import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';

const StoryDetail = () => {
    const route = useRoute();
    const { story } = route.params; // Get the 'story' passed via navigation

    return (
        <ScrollView style={styles.container}>
            <Image source={{ uri: story.storyPhoto }} style={styles.image} />
            <View style={styles.contentContainer}>
                <Text style={styles.title}>{story.title}</Text>
                <Text style={styles.content}>{story.content}</Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f4',
        paddingBottom: 20,
    },
    image: {
        width: '100%',
        height: 300,
        borderRadius: 12,
        marginBottom: 20,
        resizeMode: 'cover',
    },
    contentContainer: {
        paddingHorizontal: 15,
        paddingTop: 20,
        backgroundColor: '#fff',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: -2 },
        shadowRadius: 10,
        elevation: 5,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    date: {
        fontSize: 14,
        color: '#aaa',
        marginBottom: 15,
    },
    content: {
        fontSize: 16,
        color: '#444',
        lineHeight: 24,
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 10,
    },
    buttonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
    },
});

export default StoryDetail;
