import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'; // Import FontAwesome for icons

// Replace with your backend URL
const socket = io("http://192.168.137.1:8080/");
// const socket = io("https://varkari-sampraday.onrender.com");


const TrackerScreen = () => {
    const [location, setLocation] = useState(null);
    const [warkaris, setWarkaris] = useState([]);
    const [mapRegion, setMapRegion] = useState(null);
    const [role, setRole] = useState(null);
    const [nearbyPlaces, setNearbyPlaces] = useState([]); // Store nearby places

    const userId = useSelector((state) => state.auth.user._id);

    useEffect(() => {
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
        if (!role) return;

        if (role === "warkari") {
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

                        const newRegion = {
                            latitude: coords.latitude,
                            longitude: coords.longitude,
                            latitudeDelta: 0.005,
                            longitudeDelta: 0.005,
                        };
                        setMapRegion(newRegion);

                        // Send location to backend
                        socket.emit("updateLocation", {
                            userId: userId,
                            latitude: coords.latitude,
                            longitude: coords.longitude,
                        });

                        // Fetch nearby places when location is updated
                        fetchNearbyPlaces(coords.latitude, coords.longitude);
                    }
                );
            })();
        } else if (role === "family_member") {
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

            socket.emit("getLocation", userId);
        }

        return () => {
            socket.disconnect();
        };
    }, [role, userId]);

    // Fetch nearby places from OpenStreetMap's Nominatim API
    const fetchNearbyPlaces = async (latitude, longitude) => {
        try {
            const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];(node["amenity"="restaurant"](around:5000,${latitude},${longitude});node["amenity"="hotel"](around:5000,${latitude},${longitude});node["amenity"="toilets"](around:5000,${latitude},${longitude}););out;`;

            const response = await fetch(overpassUrl);
            const data = await response.json();

            console.log("Nearby Places Data:", data);

            if (data.elements.length) {
                const places = data.elements.map((place) => {
                    // Determine the icon based on the amenity
                    let icon;
                    if (place.tags.amenity === "restaurant") {
                        icon = "utensils";  // FontAwesome 5 icon for restaurant
                    } else if (place.tags.amenity === "hotel") {
                        icon = "hotel"; // FontAwesome 5 icon for hotel
                    } else if (place.tags.amenity === "toilets") {
                        icon = "toilet"; // FontAwesome 5 icon for toilets
                    } else {
                        icon = "question"; // Default icon for other places
                    }

                    return {
                        id: place.id,
                        type: place.tags.amenity,
                        name: place.tags.name || "Unnamed",
                        latitude: place.lat,
                        longitude: place.lon,
                        icon: icon,
                    };
                });

                setNearbyPlaces(places);  // Store nearby places to display on the map
            } else {
                console.log("No nearby places found.");
            }
        } catch (error) {
            console.error("Error fetching nearby places:", error);
        }
    };

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                region={mapRegion}
                showsUserLocation={true}
                followsUserLocation={true}
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

                {/* Add markers for nearby places */}
                {nearbyPlaces.map((place) => (
                    <Marker
                        key={place.id}
                        coordinate={{
                            latitude: parseFloat(place.latitude),
                            longitude: parseFloat(place.longitude),
                        }}
                        title={place.name}
                        description={`Type: ${place.type}`}
                    >
                        <FontAwesome5
                            name={place.icon}  // Use FontAwesome icon name
                            size={30}
                            color="blue"  // Change color to match your theme
                        />
                    </Marker>
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
