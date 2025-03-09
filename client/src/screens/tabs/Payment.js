import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import RootTab from '../../navigation/Tabs/RootTab';
import client from '../../lib/axios';
import * as SecureStore from 'expo-secure-store';

const Payment = () => {
    const [bill, setBill] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch the bill when the component mounts
    useEffect(() => {
        const fetchBill = async () => {
            try {
                const token = await SecureStore.getItemAsync('authToken');
                const response = await client.get('/cart/get-bill', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                setBill(response.data.bill);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching the bill:", error);
                setLoading(false);
            }
        };

        fetchBill();
    }, []);

    if (loading) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    if (!bill) {
        return (
            <View style={styles.container}>
                <Text style={styles.noDataText}>No bill data available</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your Bill</Text>

            <ScrollView contentContainerStyle={styles.billContainer}>
                <View style={styles.itemsContainer}>
                    {bill.items.map((item, index) => (
                        <View key={index} style={styles.itemRow}>
                            <Text style={styles.itemName}>{item.productName}</Text>
                            <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
                            <Text style={styles.itemPrice}>₹{item.total}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.totalRow}>
                    <Text style={styles.totalText}>Total Amount:</Text>
                    <Text style={styles.totalAmount}>₹{bill.totalAmount}</Text>
                </View>
            </ScrollView>

            {/* Payment Button */}
            <TouchableOpacity style={styles.paymentButton}>
                <Text style={styles.paymentButtonText}>Proceed to Payment</Text>
            </TouchableOpacity>

            <RootTab />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginVertical: 20,
        marginTop: 50
    },
    loadingText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#4CAF50',
        textAlign: 'center',
    },
    noDataText: {
        fontSize: 18,
        color: '#FF5733',
        textAlign: 'center',
    },
    billContainer: {
        marginTop: 10,
        paddingBottom: 20,
    },
    itemsContainer: {
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        paddingVertical: 12,
        paddingHorizontal: 15,
        marginBottom: 12,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    itemName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        flex: 3,
    },
    itemQuantity: {
        fontSize: 16,
        color: '#777',
        flex: 1,
        textAlign: 'center',
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: '600',
        color: '#4CAF50',
        flex: 1,
        textAlign: 'center',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
        marginBottom: 30,
    },
    totalText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    totalAmount: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    paymentButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 30,
    },
    paymentButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default Payment;
