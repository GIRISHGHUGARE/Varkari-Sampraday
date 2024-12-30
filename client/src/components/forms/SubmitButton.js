import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';

const SubmitButton = ({ handleSubmit, btnTitle, loading }) => {
    return (
        <TouchableOpacity className="h-12 justify-center mb-5" style={{ marginHorizontal: 25, backgroundColor: "#812F21", borderRadius: 10 }} onPress={handleSubmit}>
            <Text className="color-white text-center text-2xl font-normal" >
                {loading ? 'Please Wait...' : btnTitle}
            </Text>
        </TouchableOpacity>
    );
}

export default SubmitButton;