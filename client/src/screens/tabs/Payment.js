import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput, Modal, Button } from 'react-native';
import RootTab from '../../navigation/Tabs/RootTab';
import client from '../../lib/axios';
import * as SecureStore from 'expo-secure-store';

const Payment = ({ navigation }) => {
    const [bill, setBill] = useState(null);
    const [placedBill, setPlacedBill] = useState(null);
    const [loading, setLoading] = useState(true);
    const [calculatedTotal, setCalculatedTotal] = useState(0);

    // Modal state for shipping details
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [shippingAddress, setShippingAddress] = useState('');
    const [mobile, setMobile] = useState('');

    // Timer state for the countdown
    const [timer, setTimer] = useState(60); // 60 seconds countdown
    const [isOrderPlaced, setIsOrderPlaced] = useState(false); // Track if order has been placed
    const [isOrderCanceled, setIsOrderCanceled] = useState(false); // Track if order is canceled

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
                calculateTotal(response.data.bill);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching the bill:", error);
                setLoading(false);
            }
        };

        fetchBill();
    }, []);

    useEffect(() => {
        let countdownInterval;

        if (timer > 0 && isOrderPlaced && !isOrderCanceled) {
            countdownInterval = setInterval(() => {
                setTimer((prevTime) => prevTime - 1);
            }, 1000);
        } else if (timer === 0 && !isOrderCanceled) {
            clearInterval(countdownInterval);
            setIsOrderCanceled(true);
            Alert.alert("Time's up", "The order can no longer be canceled.");
            setIsOrderPlaced(true); // Lock the order in the "placed" state
            navigation.navigate('Home'); // Redirect to Home after timer ends
        }

        return () => clearInterval(countdownInterval); // Cleanup interval on component unmount
    }, [timer, isOrderPlaced, isOrderCanceled]);

    const calculateTotal = (bill) => {
        let totalAmount = bill.totalAmount;
        const taxes = totalAmount * 0.1;
        const shippingFee = 50;
        const finalAmount = totalAmount + taxes + shippingFee;
        setCalculatedTotal(finalAmount);
    };

    const handlePlaceOrder = async () => {
        if (!shippingAddress || !mobile) {
            alert("Please provide both shipping address and mobile number.");
            return;
        }

        const token = await SecureStore.getItemAsync('authToken');

        Alert.alert(
            "Confirm Order",
            "Are you sure you want to place the order?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Confirm",
                    onPress: async () => {
                        try {
                            const response = await client.post(
                                '/cart/create-bill',
                                { shippingAddress, mobile },
                                { headers: { Authorization: `Bearer ${token}` } }
                            );
                            if (response.data.success) {
                                alert("Order placed successfully!");
                                setPlacedBill(response.data.bill);
                                setIsOrderPlaced(true); // Start the order and timer
                                setTimer(60); // Reset the timer after placing the order
                            }
                        } catch (error) {
                            console.error("Error placing the order:", error);
                            alert("There was an error placing your order.");
                        }
                    }
                }
            ]
        );
    };

    const handleProceedPayment = () => {
        setIsModalVisible(true); // Show modal when Proceed to Payment is clicked
    };

    const handleModalSubmit = () => {
        if (!shippingAddress || !mobile) {
            alert("Please provide both shipping address and mobile number.");
            return;
        }
        setIsModalVisible(false); // Close the modal
        handlePlaceOrder(); // Proceed with the order placement
    };

    const handleCancelOrder = async () => {
        if (timer === 0 || isOrderCanceled) {
            alert("Order cannot be canceled now as the timer has finished.");
            return;
        }

        if (!placedBill || !placedBill._id) {
            alert("Placed bill not available. Please try again.");
            return;
        }
        console.log(placedBill._id)
        const token = await SecureStore.getItemAsync('authToken');
        const billId = placedBill._id; // Assuming the bill ID is available in the `placedBill` object

        try {
            const response = await client.delete(`/cart/remove-bill/${billId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data.success) {
                setIsOrderCanceled(true);
                alert("Order canceled successfully.");
                navigation.navigate('Home'); // Redirect to Home after cancel
            }
        } catch (error) {
            console.error("Error canceling the order:", error);
            alert("There was an error canceling the order.");
        }
    };

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

            {!isOrderPlaced ? (
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

                    <View style={styles.totalCard}>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalText}>Total Amount:</Text>
                            <Text style={styles.totalAmount}>₹{bill.totalAmount}</Text>
                        </View>

                        <View style={styles.totalRow}>
                            <Text style={styles.totalText}>Taxes (10%):</Text>
                            <Text style={styles.totalAmount}>₹{(bill.totalAmount * 0.1).toFixed(2)}</Text>
                        </View>

                        <View style={styles.totalRow}>
                            <Text style={styles.totalText}>Shipping Fee:</Text>
                            <Text style={styles.totalAmount}>₹50</Text>
                        </View>

                        <View style={styles.totalRow}>
                            <Text style={styles.totalText}>Total:</Text>
                            <Text style={styles.totalAmount}>₹{calculatedTotal.toFixed(2)}</Text>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.paymentButton} onPress={handleProceedPayment}>
                        <Text style={styles.paymentButtonText}>Proceed to Payment</Text>
                    </TouchableOpacity>
                </ScrollView>
            ) : (
                <View style={styles.container}>
                    <Text style={styles.noDataText}>Order Placed!</Text>
                    <Text style={styles.noDataText}>You can no longer cancel after the timer ends.</Text>

                    {/* Timer Display */}
                    <Text style={styles.timerText}>Time remaining: {timer}s</Text>

                    {/* Cancel Order Button */}
                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={handleCancelOrder}
                    >
                        <Text style={styles.cancelButtonText}>Cancel Order</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Modal for Shipping Address and Mobile Number */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Enter Shipping Details</Text>
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Shipping Address"
                            value={shippingAddress}
                            onChangeText={setShippingAddress}
                        />
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Mobile Number"
                            value={mobile}
                            onChangeText={setMobile}
                            keyboardType="phone-pad"
                        />
                        <View style={styles.modalButtonContainer}>
                            <Button title="Submit" onPress={handleModalSubmit} />
                            <Button title="Cancel" onPress={() => setIsModalVisible(false)} color="red" />
                        </View>
                    </View>
                </View>
            </Modal>

            <RootTab />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f4',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginTop: 40,
        marginBottom: 20,
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
        paddingHorizontal: 20,
    },
    itemsContainer: {
        marginBottom: 20,
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        paddingVertical: 12,
        paddingHorizontal: 15,
        marginBottom: 12,
        borderRadius: 8,
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
    totalCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingVertical: 20,
        paddingHorizontal: 20,
        elevation: 5,
        marginBottom: 20,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    totalText: {
        fontSize: 18,
        fontWeight: '500',
        color: '#333',
    },
    totalAmount: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    timerText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ff6347',
        textAlign: 'center',
        marginTop: 20,
    },
    cancelButton: {
        backgroundColor: '#FF6347',
        padding: 10,
        borderRadius: 8,
        marginTop: 10,
        margin: 20,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    paymentButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 8,
        marginHorizontal: 20,
        marginTop: 20,
        alignItems: 'center',
    },
    paymentButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalInput: {
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

export default Payment;
