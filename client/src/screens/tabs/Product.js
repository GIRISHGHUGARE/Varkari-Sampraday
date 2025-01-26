import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import RootTab from '../../navigation/Tabs/RootTab';
import ProductCard from '../../components/cards/ProductCard';
import { fetchProducts } from '../../redux/features/product/productSlice';

const Product = () => {
    const dispatch = useDispatch();
    const products = useSelector((state) => state.product);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        dispatch(fetchProducts());

    }, [dispatch]);
    const onRefresh = async () => {
        setRefreshing(true);
        await dispatch(fetchProducts());
        setRefreshing(false);
    };

    return (
        <View style={styles.container}>
            {/* <RootDrawer /> */}
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <ProductCard products={products} />
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

export default Product;