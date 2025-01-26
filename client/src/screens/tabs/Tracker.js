import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { io } from "socket.io-client";
import RootTab from '../../navigation/Tabs/RootTab';
import { useSelector } from "react-redux";

const socket = io("http://192.168.0.112:8080"); // Replace with your backend URL

const TrackerScreen = () => {
    const [location, setLocation] = useState(null);
    const [warkaris, setWarkaris] = useState([]);
    const [mapRegion, setMapRegion] = useState(null);
    const userId = useSelector((state) => state.auth.user._id);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                console.error("Permission to access location denied");
                return;
            }

            Location.watchPositionAsync(
                { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 10 },
                (loc) => {
                    const coords = loc.coords;
                    setLocation(coords);

                    // Dynamically update map focus
                    setMapRegion({
                        latitude: coords.latitude,
                        longitude: coords.longitude,
                        latitudeDelta: 0.01, // Adjust zoom level
                        longitudeDelta: 0.01,
                    });

                    socket.emit("updateLocation", {
                        userId: userId, // Replace with actual user ID
                        latitude: coords.latitude,
                        longitude: coords.longitude,
                    });
                }
            );
        })();

        socket.on("locationUpdated", (data) => {
            setWarkaris((prev) => {
                const index = prev.findIndex((w) => w.userId === data.userId);
                if (index !== -1) {
                    prev[index] = data;
                    return [...prev];
                }
                return [...prev, data];
            });
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                region={mapRegion} // Automatically focus on updated region
            >
                {warkaris.map((warkari) => (
                    <Marker
                        key={warkari.userId}
                        coordinate={{
                            latitude: warkari.currentLocation.latitude,
                            longitude: warkari.currentLocation.longitude,
                        }}
                        title={`Warkari ID: ${warkari.userId}`}
                    />
                ))}
            </MapView>
            {/* <RootTab /> */}
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
