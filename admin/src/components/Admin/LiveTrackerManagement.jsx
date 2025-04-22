import React, { useEffect, useState } from "react";
import client from "../../lib/axios";
import { FaEdit, FaTrashAlt, FaPlusCircle, FaArrowLeft } from "react-icons/fa";
import toast from "react-hot-toast";

const LiveTrackerManagement = () => {
    const [trackers, setTrackers] = useState([]);
    const [newTracker, setNewTracker] = useState({
        user: "",
        latitude: "",
        longitude: "",
    });
    const [editingTracker, setEditingTracker] = useState(null);
    const token = localStorage.getItem("authToken");

    useEffect(() => {
        fetchTrackers();
    }, []);

    const fetchTrackers = async () => {
        try {
            const response = await client.get("/admin/livetracker", {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log(response.data.liveTrackers);
            setTrackers(response.data.liveTrackers);
        } catch (error) {
            console.error("Error fetching live trackers", error);
        }
    };

    const createTracker = async () => {
        const trackerData = {
            user: newTracker.user,
            currentLocation: {
                latitude: newTracker.latitude,
                longitude: newTracker.longitude,
            },
        };

        try {
            const response = await client.post("/admin/livetrackers", trackerData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            setTrackers([...trackers, response.data]);
            setNewTracker({ user: "", latitude: "", longitude: "" });
            fetchTrackers();
            toast.success("Tracker created successfully!");
        } catch (error) {
            console.error("Error creating tracker", error);
            toast.error("Error creating tracker!");
        }
    };

    const updateTracker = async (id, updatedTracker) => {
        const trackerData = {
            user: updatedTracker.user || "",
            currentLocation: {
                latitude: updatedTracker.latitude || "",
                longitude: updatedTracker.longitude || "",
            },
        };

        try {
            const response = await client.put(`/admin/livetrackers/${id}`, trackerData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            setTrackers(trackers.map((tracker) => (tracker._id === id ? response.data : tracker)));
            setEditingTracker(null);
            fetchTrackers();
            toast.success("Tracker updated successfully!");
        } catch (error) {
            console.error("Error updating tracker", error);
            toast.error("Error updating tracker!");
        }
    };

    const deleteTracker = async (id) => {
        try {
            await client.delete(`/admin/livetrackers/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTrackers(trackers.filter((tracker) => tracker._id !== id));
            fetchTrackers();
            toast.success("Tracker deleted successfully!");
        } catch (error) {
            console.error("Error deleting tracker", error);
            toast.error("Error deleting tracker!");
        }
    };

    return (
        <div className="container p-4 mx-auto">
            <h2 className="text-2xl text-center font-semibold mb-6">Live Tracker Management</h2>

            {/* Tracker List */}
            <div>
                <h3 className="text-xl font-semibold mb-4">Tracker List</h3>
                {Array.isArray(trackers) && trackers.length > 0 ? (  // Check if trackers is an array
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {trackers.map((tracker) => (
                            <div
                                key={tracker._id}
                                className="transition-transform transform hover:scale-105 bg-white rounded-lg shadow-lg p-4 flex flex-col justify-between space-y-4 hover:shadow-xl"
                            >
                                <div className="flex flex-col items-center space-y-2">
                                    <div className="text-center">
                                        <span className="text-lg font-semibold text-gray-800">
                                            User: {tracker.user.username} {/* Use a valid property of user */}
                                        </span>
                                        <p className="text-gray-600 text-sm">
                                            Latitude: {tracker.currentLocation.latitude}
                                        </p>
                                        <p className="text-gray-600 text-sm">
                                            Longitude: {tracker.currentLocation.longitude}
                                        </p>
                                        <p className="text-gray-600 text-sm">
                                            Timestamp: {new Date(tracker.timestamp).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-4 mt-4">
                                    <button
                                        onClick={() => deleteTracker(tracker._id)}
                                        className="text-red-500 hover:text-red-600 transition"
                                    >
                                        <FaTrashAlt />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No trackers found.</p> // Fallback message if there are no trackers
                )}
            </div>

        </div>
    );
};

export default LiveTrackerManagement;
