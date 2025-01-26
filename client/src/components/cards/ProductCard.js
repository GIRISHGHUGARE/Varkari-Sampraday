import React, { useState } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';

const ProductCard = ({ products }) => {
    const [product, setProduct] = useState({});
    const [currentPostId, setCurrentPostId] = useState(null);
    const navigation = useNavigation();

    return (
        <ScrollView contentContainerStyle={styles.cardContainer}>
            {products?.product.map((postItem, i) => (
                <View style={styles.card} key={i}>

                    {/* Product Image */}
                    {postItem.productPhoto && (
                        <Image
                            source={{ uri: postItem.productPhoto }}
                            style={styles.productImage}
                            resizeMode="cover"
                        />
                    )}
                    {/* Product Name */}
                    <Text style={styles.productName}>{postItem.name}</Text>

                    {/* Product Description */}
                    <Text style={styles.productDescription}>{postItem.description}</Text>

                    {/* Price and Quantity */}
                    <View style={styles.priceQuantity}>
                        <Text style={styles.price}>₹{postItem.price}</Text>
                        <Text style={styles.quantity}>Stock: {postItem.quantity}</Text>
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.actions}>
                        <TouchableOpacity onPress={() => console.log(`Add ${postItem.name} to cart`)} style={styles.actionButton}>
                            <FontAwesome5 name="shopping-cart" size={20} color="#fff" />
                            <Text style={styles.actionText}>Add to Cart</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        paddingBottom: 20,
    },
    card: {
        margin: 15,
        padding: 20,
        backgroundColor: "#fff",
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
    },
    productName: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#333",
    },
    productImage: {
        width: "100%",
        height: 200,
        borderRadius: 10,
        marginBottom: 15,
        objectFit: "scale-down"
    },
    productDescription: {
        fontSize: 14,
        color: "#555",
        marginBottom: 10,
    },
    priceQuantity: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 15,
    },
    price: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#28a745",
    },
    quantity: {
        fontSize: 14,
        color: "#888",
    },
    actions: {
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    actionButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#812F21",
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 25,
        width: "45%",
        justifyContent: "center",
    },
    actionText: {
        marginLeft: 8,
        color: "#fff",
        fontSize: 14,
    },
});

export default ProductCard;
