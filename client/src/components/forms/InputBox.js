import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'; // Import FontAwesome5
import { LinearGradient } from 'expo-linear-gradient'; // Import LinearGradient

const InputBox = ({ inputTitle, keyboardType, autoComplete, secureTextEntry, value, setValue, iconStart, iconEnd }) => {
    const [isPasswordShown, setIsPasswordShown] = useState(secureTextEntry);
    const [isFocused, setIsFocused] = useState(false); // Track the focus state

    // Conditional styling for the input container when focused
    const inputContainerStyles = isFocused ? [styles.inputContainer, styles.focused] : styles.inputContainer;

    return (
        <View>
            <Text style={{ color: "#A4A4A4", fontSize: 18, fontFamily: 'Poppins_400Regular', marginTop: 10 }}>
                {inputTitle}
            </Text>

            {/* Apply LinearGradient to the whole input container */}
            <LinearGradient
                colors={['#4B5563', '#6B7280']} // Example gradient colors
                style={[inputContainerStyles, { borderRadius: 10 }]} // Apply gradient as the container's background
                start={{ x: 0, y: 0 }} // Start point of the gradient
                end={{ x: 1, y: 0 }}   // End point of the gradient
            >
                {/* Icon at the start of the input */}
                {iconStart && (
                    <FontAwesome5 name={iconStart} size={20} color="#A4A4A4" style={{ marginRight: 10, marginLeft: 10 }} />
                )}

                <TextInput
                    style={[styles.inputBox, { borderRadius: 10 }]} // Ensure the TextInput itself has rounded corners
                    autoCorrect={false}
                    keyboardType={keyboardType}
                    autoComplete={autoComplete}
                    secureTextEntry={isPasswordShown} // Toggle visibility based on the state
                    value={value}
                    onChangeText={(text) => setValue(text)}
                    onFocus={() => setIsFocused(true)} // Set focus state to true when focused
                    onBlur={() => setIsFocused(false)} // Set focus state to false when blurred
                />

                {/* Icon at the end of the input */}
                {iconEnd && (
                    <TouchableOpacity
                        onPress={() => setIsPasswordShown(prevState => !prevState)} // Toggle password visibility
                    >
                        <FontAwesome5
                            name={isPasswordShown ? 'eye-slash' : 'eye'}
                            size={20}
                            color="#A4A4A4"
                            style={{ marginLeft: 10 }}
                        />
                    </TouchableOpacity>
                )}
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
        marginVertical: 10,
        paddingHorizontal: 10, // Padding around the text and icons
        borderWidth: 1,
        borderColor: "#6B7280",
        backgroundColor: 'transparent', // Gradient will cover the background
    },
    focused: {
        borderColor: '#FFFFFF', // Border color when focused
    },
    inputBox: {
        flex: 1, // TextInput takes up all available space
        paddingLeft: 10, // Padding for the text
        fontSize: 18,
        fontFamily: 'Poppins_400Regular', // Set the font family
        color: 'white', // Text color
        justifyContent: "center",
        marginBottom: 0,
        marginTop: 0,
        paddingTop: 0,
        paddingBottom: 0
    },
});

export default InputBox;
