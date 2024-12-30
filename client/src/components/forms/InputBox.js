import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'; // Import FontAwesome5

const InputBox = ({ inputTitle, keyboardType, autoComplete, secureTextEntry, value, setValue, iconStart, iconEnd }) => {
    const [isPasswordShown, setIsPasswordShown] = useState(secureTextEntry);
    return (
        <View>
            <Text className="color-black font-bold text-xl">{inputTitle}</Text>
            <View className="flex-row items-center border border-gray-500 bg-white h-12" style={styles.inputContainer}>
                {/* Icon at the start of the input */}
                {iconStart && (
                    <FontAwesome5 name={iconStart} size={20} color="black" className="mr-3" />
                )}
                <TextInput
                    className="flex-1 h-full"
                    style={styles.inputBox}
                    autoCorrect={false}
                    keyboardType={keyboardType}
                    autoComplete={autoComplete}
                    secureTextEntry={isPasswordShown} // Toggle visibility based on the state
                    value={value}
                    onChangeText={(text) => setValue(text)}
                />
                {/* Icon at the end of the input */}
                {iconEnd && (
                    <TouchableOpacity
                        onPress={() => setIsPasswordShown(prevState => !prevState)} // Toggle password visibility
                    >
                        <FontAwesome5
                            name={isPasswordShown ? 'eye-slash' : 'eye'}
                            size={20}
                            color="black"
                            className="ml-3"
                        />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row', // Align the icon and input field horizontally
        alignItems: 'center', // Vertically center the icon and text
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 10,
        backgroundColor: "#ffffff",
        height: 50,
        marginVertical: 10,
        paddingHorizontal: 10, // Add padding around the text
    },
    inputBox: {
        flex: 1, // Take up all remaining space
        height: '100%',
        paddingLeft: 10, // Add some padding to the left of the text input
        fontSize: 18,
        color: 'black',
        backgroundColor: 'transparent', // Make background transparent for seamless icon integration
        fontFamily: 'Poppins_400Regular', // Set the font family to Poppins
    },
});

export default InputBox;