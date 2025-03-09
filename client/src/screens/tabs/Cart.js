import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, RefreshControl } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart, removeFromCart, updateCartQuantity } from '../../redux/features/cart/cartSlice';
import RootTab from '../../navigation/Tabs/RootTab';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native'; // Import navigation hook

const Cart = () => {
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart);
    const [isRefreshing, setIsRefreshing] = useState(false);  // Track the refresh state
    const navigation = useNavigation();  // Hook for navigation

    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch]);

    // Handle remove action
    const handleRemove = (productId) => {
        dispatch(removeFromCart(productId));
        dispatch(fetchCart());
    };

    // Handle quantity update
    const handleUpdateQuantity = (productId, quantity) => {
        dispatch(updateCartQuantity({ productId, quantity }));
        dispatch(fetchCart());
    };

    // Refresh handler
    const onRefresh = () => {
        setIsRefreshing(true);
        dispatch(fetchCart())
            .finally(() => setIsRefreshing(false));  // Stop refreshing after the cart is fetched
    };

    // Payment button handler
    const handlePayment = () => {
        if (cart.items && cart.items.length > 0) {
            // Navigate to payment page if the cart is not empty
            navigation.navigate('Payment');  // Navigate to 'Payment' screen (make sure you have this screen in your navigation stack)
        } else {
            // Handle empty cart scenario (optional)
            alert('Your cart is empty. Please add items before proceeding to payment.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your Cart</Text>
            <ScrollView
                contentContainerStyle={styles.cartContainer}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={onRefresh}  // Trigger the refresh on pull
                        colors={['#812F21']}  // Optional: Set the color of the loading spinner
                        tintColor="#812F21"    // Optional: Set the spinner color
                    />
                }
            >
                {cart.items?.map((item) => (
                    <View key={item._id} style={styles.cartItem}>
                        {/* Product Image */}
                        <Image
                            source={{ uri: item.product.productPhoto || 'https://via.placeholder.com/150' }}
                            style={styles.productImage}
                            resizeMode="cover"
                        />
                        <View style={styles.productDetails}>
                            {/* Product Name */}
                            <Text style={styles.productName}>{item.product.name}</Text>
                            {/* Product Price */}
                            <Text style={styles.productPrice}>₹{item.product.price}</Text>
                            {/* Quantity Controls */}
                            <View style={styles.quantityContainer}>
                                <TouchableOpacity
                                    onPress={() => handleUpdateQuantity(item.product._id, item.quantity - 1)}
                                    style={styles.quantityButton}>
                                    <FontAwesome5 name="minus" size={16} color="#fff" />
                                </TouchableOpacity>
                                <Text style={styles.quantity}>{item.quantity}</Text>
                                <TouchableOpacity
                                    onPress={() => handleUpdateQuantity(item.product._id, item.quantity + 1)}
                                    style={styles.quantityButton}>
                                    <FontAwesome5 name="plus" size={16} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        </View>
                        {/* Remove Button */}
                        <TouchableOpacity
                            onPress={() => handleRemove(item.product._id)}
                            style={styles.removeButton}>
                            <FontAwesome5 name="trash" size={18} color="#fff" />
                            <Text style={styles.removeButtonText}>Remove</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>

            {/* Payment Button */}
            <TouchableOpacity
                onPress={handlePayment}
                style={styles.paymentButton}>
                <Text style={styles.paymentButtonText}>Review Your Order</Text>
            </TouchableOpacity>

            <RootTab />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f8f8",
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginTop: 40,
        marginBottom: 10,
        color: '#333',
        padding: 10
    },
    cartContainer: {
        paddingBottom: 20,
        padding: 10
    },
    cartItem: {
        flexDirection: 'row',
        padding: 15,
        backgroundColor: '#fff',
        marginBottom: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
        alignItems: 'center',
    },
    productImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 15,
    },
    productDetails: {
        flex: 1,
    },
    productName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    productPrice: {
        fontSize: 16,
        color: '#888',
        marginVertical: 5,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    quantityButton: {
        width: 30,
        height: 30,
        backgroundColor: '#812F21',
        margin: 5,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantity: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    removeButton: {
        backgroundColor: '#f44336',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        flexDirection: 'row',
    },
    removeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 5,
    },
    paymentButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 5,
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 20,
        marginBottom: 20,
    },
    paymentButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default Cart;
