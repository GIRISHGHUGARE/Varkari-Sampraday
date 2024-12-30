import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import RootTab from '../../navigation/Tabs/RootTab';
const Profile = () => {
    return (
        <View className="flex-1 bg-white">
            <ScrollView>
                <Text className="flex-1 text-center bg-red-400">Profile</Text>
            </ScrollView>
            <RootTab />
        </View>
    )
}

export default Profile