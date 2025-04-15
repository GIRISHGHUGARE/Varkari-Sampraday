import { View, Text, ImageBackground, TouchableOpacity, StyleSheet, Linking, Image } from 'react-native';
import React from 'react';
import { BlurView } from 'expo-blur';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const Settings = () => {
    const handleCallSupport = () => {
        Linking.openURL('tel:8369640647');
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ImageBackground
                source={require('../../../assets/Background.png')}
                style={styles.background}
            >
                <BlurView intensity={15} style={styles.blurContainer}>
                    <View style={styles.header}>
                        <Image
                            source={require('../../../assets/iconbg.png')}
                            style={styles.logo}
                        />
                        <Text style={styles.title}>Settings</Text>
                    </View>

                    <TouchableOpacity style={styles.optionCard} onPress={handleCallSupport}>
                        <MaterialIcons name="support-agent" size={30} color="#FFD700" />
                        <Text style={styles.optionText}>Call Customer Support</Text>
                    </TouchableOpacity>
                </BlurView>
            </ImageBackground>
        </SafeAreaView >
    );
};

export default Settings;

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
        backgroundColor: "#000000"
    },
    blurContainer: {
        flex: 1,
        padding: 20,
        borderRadius: 0,
        margin: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    logo: {
        width: 90,
        height: 90,
        marginBottom: 10,
    },
    title: {
        fontSize: 26,
        color: '#FFD700',
        fontWeight: 'bold',
    },
    optionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 20,
        padding: 20,
        marginVertical: 10,
    },
    optionText: {
        color: '#fff',
        fontSize: 18,
        marginLeft: 15,
    },
});
