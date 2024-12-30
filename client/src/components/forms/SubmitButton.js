import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const SubmitButton = ({ handleSubmit, btnTitle, loading }) => {
    return (
        <LinearGradient
            colors={['#DDD5AE', '#9C6536', '#812F21',]} // Gradient colors
            start={{ x: 0, y: 0 }} // Start point of the gradient (left)
            end={{ x: 1, y: 0 }}   // End point of the gradient (right)
            style={styles.button}  // Apply styles to the button
        >
            <TouchableOpacity onPress={handleSubmit} style={styles.buttonContent}>
                <Text style={styles.buttonText} className="font-poppinsBold">
                    {loading ? 'Please Wait...' : btnTitle}
                </Text>
            </TouchableOpacity>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    button: {
        height: 50,            // Button height
        justifyContent: 'center',
        borderRadius: 10,      // Border radius
        marginHorizontal: 25,  // Margin on the sides
    },
    buttonContent: {
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%', // Take up full height of the gradient container
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
        textAlign: 'center',
    },
});

export default SubmitButton;
