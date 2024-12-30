import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React from 'react'
import RootTab from '../../navigation/Tabs/RootTab';

const Home = () => {
    return (
        <View className="flex-1 bg-white">
            <ScrollView>
                <Text>Home</Text>
            </ScrollView>
            <RootTab />
        </View>
    )
}
export default Home