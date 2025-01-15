import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import PostCard from '../../components/cards/PostCard';
import { fetchPosts } from '../../redux/features/post/postSlice';
import RootTab from '../../navigation/Tabs/RootTab';

const Home = () => {
    const dispatch = useDispatch();
    const posts = useSelector((state) => state.post);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        dispatch(fetchPosts());
    }, [dispatch]);

    const onRefresh = async () => {
        setRefreshing(true);
        await dispatch(fetchPosts());
        setRefreshing(false);
    };

    return (
        <View style={styles.container}>
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <PostCard posts={posts} myPostScreen={true} />
            </ScrollView>
            <RootTab />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f8f8",
    },
});

export default Home;