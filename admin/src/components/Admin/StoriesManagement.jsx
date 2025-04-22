import React, { useEffect, useState } from "react";
import client from "../../lib/axios";
import { FaEdit, FaTrashAlt, FaPlusCircle, FaArrowLeft } from "react-icons/fa";
import toast from "react-hot-toast";

const StoriesManagement = () => {
    const [stories, setStories] = useState([]);
    const [newStory, setNewStory] = useState({
        title: "",
        content: "",
        storyPhoto: "", // for the image URL
    });
    const [editingStory, setEditingStory] = useState(null);
    const token = localStorage.getItem("authToken");

    useEffect(() => {
        fetchStories();
    }, []);

    const fetchStories = async () => {
        try {
            const response = await client.get("/admin/stories", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setStories(response.data.stories);
        } catch (error) {
            console.error("Error fetching stories", error);
        }
    };

    const createStory = async () => {
        const storyData = {
            title: newStory.title,
            content: newStory.content,
            storyPhoto: newStory.storyPhoto,
        };

        try {
            const response = await client.post("/admin/stories", storyData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            setStories([...stories, response.data]);
            setNewStory({ title: "", content: "", storyPhoto: "" });
            fetchStories();
            toast.success("Story created successfully!");
        } catch (error) {
            console.error("Error creating story", error);
            toast.error("Error creating story!");
        }
    };

    const updateStory = async (id, updatedStory) => {
        const storyData = {
            title: updatedStory.title || "",
            content: updatedStory.content || "",
            storyPhoto: updatedStory.storyPhoto || "",
        };

        try {
            const response = await client.put(`/admin/stories/${id}`, storyData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            setStories(stories.map((story) => (story._id === id ? response.data : story)));
            fetchStories();
            setEditingStory(null);
            toast.success("Story updated successfully!");
        } catch (error) {
            console.error("Error updating story", error);
            toast.error("Error updating story!");
        }
    };

    const deleteStory = async (id) => {
        try {
            await client.delete(`/admin/stories/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setStories(stories.filter((story) => story._id !== id));
            fetchStories();
            toast.success("Story deleted successfully!");
        } catch (error) {
            console.error("Error deleting story", error);
            toast.error("Error deleting story!");
        }
    };

    return (
        <div className="container p-4 mx-auto">
            <h2 className="text-2xl text-center font-semibold mb-6">Stories Management</h2>

            {/* Create Story Form */}
            <div className="bg-white border p-4 rounded-lg shadow-lg mb-6">
                <h3 className="text-xl font-semibold mb-4">Add New Story</h3>
                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Story Title"
                        value={newStory.title}
                        onChange={(e) => setNewStory({ ...newStory, title: e.target.value })}
                        className="border p-2 rounded-lg w-full"
                    />
                    <textarea
                        placeholder="Story Content"
                        value={newStory.content}
                        onChange={(e) => setNewStory({ ...newStory, content: e.target.value })}
                        className="border p-2 rounded-lg w-full"
                    />
                    <input
                        type="text"
                        placeholder="Story Image URL"
                        value={newStory.storyPhoto}
                        onChange={(e) => setNewStory({ ...newStory, storyPhoto: e.target.value })}
                        className="border p-2 rounded-lg w-full"
                    />
                    <button
                        onClick={createStory}
                        className="flex bg-blue-600 justify-center p-2 rounded-lg text-white w-full hover:bg-blue-700 items-center space-x-2 transition"
                    >
                        <FaPlusCircle />
                        <span>Create Story</span>
                    </button>
                </div>
            </div>

            {/* Edit Story Form */}
            {editingStory && (
                <div className="bg-white border p-4 rounded-lg shadow-lg mb-6">
                    <h3 className="text-xl font-semibold mb-4">Edit Story</h3>
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Story Title"
                            value={editingStory.title}
                            onChange={(e) => setEditingStory({ ...editingStory, title: e.target.value })}
                            className="border p-2 rounded-lg w-full"
                        />
                        <textarea
                            placeholder="Story Content"
                            value={editingStory.content}
                            onChange={(e) => setEditingStory({ ...editingStory, content: e.target.value })}
                            className="border p-2 rounded-lg w-full"
                        />
                        <input
                            type="text"
                            placeholder="Story Image URL"
                            value={editingStory.storyPhoto}
                            onChange={(e) => setEditingStory({ ...editingStory, storyPhoto: e.target.value })}
                            className="border p-2 rounded-lg w-full"
                        />
                        <div className="flex space-x-4">
                            <button
                                onClick={() => updateStory(editingStory._id, editingStory)}
                                className="flex bg-green-600 justify-center p-2 rounded-lg text-white items-center space-x-2 transition"
                            >
                                <FaEdit />
                                <span>Update Story</span>
                            </button>
                            <button
                                onClick={() => setEditingStory(null)}
                                className="flex bg-gray-600 justify-center p-2 rounded-lg text-white items-center space-x-2 transition"
                            >
                                <FaArrowLeft />
                                <span>Cancel</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Story List */}
            <div>
                <h3 className="text-xl font-semibold mb-4">Story List</h3>
                {stories.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {stories.map((story) => (
                            <div
                                key={story._id}
                                className="transition-transform transform hover:scale-105 bg-white rounded-lg shadow-lg p-4 flex flex-col justify-between space-y-4 hover:shadow-xl"
                            >
                                <div className="flex flex-col items-center space-y-2">
                                    <img
                                        src={story.storyPhoto || "/default-story-image.png"} // Default image if no photo is available
                                        alt={`${story.title} image`}
                                        className="h-32 w-32 object-cover"
                                    />
                                    <div className="text-center">
                                        <span className="text-lg font-semibold text-gray-800">{story.title}</span>
                                        <p className="text-gray-600 text-sm">
                                            {story.content ? story.content.substring(0, 100) : "No content available"}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex justify-between space-x-4 mt-4">
                                    <button
                                        onClick={() => setEditingStory(story)}
                                        className="text-blue-500 hover:text-blue-600 transition"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => deleteStory(story._id)}
                                        className="text-red-500 hover:text-red-600 transition"
                                    >
                                        <FaTrashAlt />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No stories found.</p>
                )}

            </div>
        </div>
    );
};

export default StoriesManagement;
