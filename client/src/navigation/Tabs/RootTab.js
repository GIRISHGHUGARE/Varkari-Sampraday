import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';

const RootTab = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const tabs = [
        { name: 'Home', icon: 'home', iconType: FontAwesome5Icon },
        { name: 'Tracker', icon: 'location-dot', iconType: FontAwesome6Icon },
        { name: 'Post', icon: 'circle-plus', iconType: FontAwesome6Icon },
        { name: 'Product', icon: 'cart-shopping', iconType: FontAwesome6Icon },
        { name: 'Profile', icon: 'user-alt', iconType: FontAwesome5Icon },
    ];

    return (
        <View className="flex-row justify-between px-5 py-3 bg-white border-t border-gray-300 h-20">
            {tabs.map((tab) => {
                const Icon = tab.iconType;
                const isActive = route.name === tab.name;

                return (
                    <TouchableOpacity
                        key={tab.name}
                        className="items-center justify-center"
                        onPress={() => navigation.navigate(tab.name)}
                    >
                        <Icon
                            name={tab.icon}
                            color={route.name === tab.name ? "black" : "gray"}
                            style={{ fontSize: 25 }}
                        />
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

export default RootTab;
