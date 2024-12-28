import { View, Text } from 'react-native'
import React from 'react'
import { useFonts, Poppins_700Bold_Italic } from '@expo-google-fonts/poppins'
const Post = () => {
    const [fontsLoaded] = useFonts({
        Poppins_700Bold_Italic
    })
    return (
        <View className="flex-1 items-center justify-center bg-white">
            <Text style={{ fontFamily: "Poppins_700Bold_Italic" }}>Open up App.js to start working on your app</Text>
        </View>
    )
}

export default Post