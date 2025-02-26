import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";

const socket = io("http://ip:8080"); // Replace with your backend URL

const TrackerScreen = () => {
    const [location, setLocation] = useState(null);
    const [warkaris, setWarkaris] = useState([]); // Store multiple warkaris
    const [mapRegion, setMapRegion] = useState(null);
    const [role, setRole] = useState(null); // 'warkari' or 'family_member'

    const userId = useSelector((state) => state.auth.user._id); // Assume Redux stores user data

    useEffect(() => {
        console.log("Role selection prompt");

        // Show role selection popup on mount
        Alert.alert(
            "Select Role",
            "Are you a Warkari or a Family Member?",
            [
                { text: "Warkari", onPress: () => setRole("warkari") },
                { text: "Family Member", onPress: () => setRole("family_member") },
            ],
            { cancelable: false }
        );
    }, []);

    useEffect(() => {
        if (!role) return; // Wait for role selection before continuing

        if (role === "warkari") {
            console.log("Warkari Role Selected");

            (async () => {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== "granted") {
                    console.error("Permission to access location denied");
                    return;
                }

                // Start watching location
                Location.watchPositionAsync(
                    { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 10 },
                    (loc) => {
                        const coords = loc.coords;
                        setLocation(coords);

                        // Dynamically update map focus and zoom
                        const newRegion = {
                            latitude: coords.latitude,
                            longitude: coords.longitude,
                            latitudeDelta: 0.005, // Smaller values for zooming in
                            longitudeDelta: 0.005, // Smaller values for zooming in
                        };
                        setMapRegion(newRegion);

                        // Send location to backend
                        socket.emit("updateLocation", {
                            userId: userId,
                            latitude: coords.latitude,
                            longitude: coords.longitude,
                        });
                    }
                );
            })();
        } else if (role === "family_member") {
            // Family Member listens for Warkari's location updates
            socket.on("locationUpdated", (data) => {
                const { user, currentLocation } = data;
                if (!currentLocation) return;

                setWarkaris((prevWarkaris) => {
                    const existingWarkari = prevWarkaris.find((w) => w.user === user);
                    if (existingWarkari) {
                        return prevWarkaris.map((w) =>
                            w.user === user ? { ...w, currentLocation } : w
                        );
                    } else {
                        return [...prevWarkaris, { user, currentLocation }];
                    }
                });

                if (user === userId) {
                    setMapRegion({
                        latitude: currentLocation.latitude,
                        longitude: currentLocation.longitude,
                        latitudeDelta: 0.005,
                        longitudeDelta: 0.005,
                    });
                }
            });

            // Optionally request initial location for a specific Warkari
            socket.emit("getLocation", userId);
        }

        return () => {
            socket.disconnect(); // Cleanup on component unmount
        };
    }, [role, userId]);

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                region={mapRegion} // Automatically focus on updated region
                showsUserLocation={true}
                followsUserLocation={true} // Makes the map follow the user's location
            >
                {warkaris.map((warkari) => (
                    <Marker
                        key={warkari.user}
                        coordinate={{
                            latitude: warkari.currentLocation.latitude,
                            longitude: warkari.currentLocation.longitude,
                        }}
                        title={`Warkari ID: ${warkari.user}`}
                    />
                ))}
            </MapView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
    },
});

export default TrackerScreen;
