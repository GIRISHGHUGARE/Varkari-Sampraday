import { Tabs } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: 'lightblue',
                },
            }}
        >
            <Tabs.Screen name="index" options={{ title: "Home", tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />, }} />
            <Tabs.Screen name="tracker" options={{ title: "Tracker", tabBarIcon: ({ color }) => <FontAwesome size={28} name="location-arrow" color={color} />, }} />
            <Tabs.Screen name="post" options={{ title: "Post", tabBarIcon: ({ color }) => <FontAwesome size={28} name="plus-square" color={color} />, }} />
            <Tabs.Screen name="product" options={{ title: "Product", tabBarIcon: ({ color }) => <FontAwesome size={28} name="shopping-cart" color={color} />, }} />
            <Tabs.Screen name="profile" options={{ title: "Profile", tabBarIcon: ({ color }) => <FontAwesome size={28} name="user-circle" color={color} />, }} />
        </Tabs>
    );
}
