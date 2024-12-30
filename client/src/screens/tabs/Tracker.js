import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import RootTab from '../../navigation/Tabs/RootTab';
const Tracker = () => {
    return (
        <View className="flex-1 bg-white">
            <ScrollView>
                <Text className="flex-1 text-center bg-red-400">Tracker</Text>
            </ScrollView>
            <RootTab />
        </View>
    )
}

export default Tracker