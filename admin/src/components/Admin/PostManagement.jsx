import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrashAlt, FaArrowLeft } from "react-icons/fa";
import toast from "react-hot-toast";
import client from "../../lib/axios";

const PostManagement = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingPost, setEditingPost] = useState(null);
    const token = localStorage.getItem("authToken");

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await client.get("/admin/posts", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPosts(response.data.posts);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching posts", error);
            setLoading(false);
        }
    };

    const deletePost = async (id) => {
        try {
            await client.delete(`/admin/posts/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPosts(posts.filter((post) => post._id !== id));
            fetchPosts();
            toast.success("Post deleted successfully!");
        } catch (error) {
            console.error("Error deleting post", error);
            toast.error("Error deleting post!");
        }
    };

    const updatePost = async (id, updatedPost) => {
        try {
            const response = await client.put(`/admin/posts/${id}`, updatedPost, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPosts(posts.map((post) => (post._id === id ? response.data : post)));
            fetchPosts();
            setEditingPost(null);
            toast.success("Post updated successfully!");
        } catch (error) {
            console.error("Error updating post", error);
            toast.error("Error updating post!");
        }
    };

    return (
        <div className="container p-4 mx-auto">
            <h2 className="text-2xl font-semibold text-center mb-6">Post Management</h2>

            {/* Edit Post Form */}
            {editingPost && (
                <div className="bg-white border p-4 rounded-lg shadow-lg mb-6">
                    <h3 className="text-xl font-semibold mb-4">Edit Post</h3>
                    {/* Post Edit Form goes here */}
                    <button
                        onClick={() => updatePost(editingPost._id, editingPost)}
                        className="flex bg-green-600 text-white p-2 rounded-lg justify-center space-x-2 items-center hover:bg-green-700 transition"
                    >
                        <FaEdit />
                        <span>Update Post</span>
                    </button>
                    <button
                        onClick={() => setEditingPost(null)}
                        className="flex bg-gray-600 text-white p-2 rounded-lg justify-center space-x-2 items-center hover:bg-gray-700 transition mt-4"
                    >
                        <FaArrowLeft />
                        <span>Cancel</span>
                    </button>
                </div>
            )}

            {/* Post List */}
            <div>
                <h3 className="text-xl font-semibold mb-4">Post List</h3>
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {posts.map((post) => (
                            <div
                                key={post._id}
                                className="transition-transform transform hover:scale-105 bg-white rounded-lg shadow-lg p-4 flex flex-col justify-between space-y-4 hover:shadow-xl"
                            >
                                <div className="flex flex-col items-center space-y-2">
                                    <img
                                        src={post.uploadedPhoto || "/default-post-image.png"}
                                        alt="Post"
                                        className="h-32 w-32 object-cover rounded-lg"
                                    />
                                    <h4 className="font-semibold text-center">{post.caption}</h4>
                                </div>
                                <div className="flex justify-between space-x-4 mt-4">
                                    <button
                                        onClick={() => setEditingPost(post)}
                                        className="text-blue-500 hover:text-blue-600 transition"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => deletePost(post._id)}
                                        className="text-red-500 hover:text-red-600 transition"
                                    >
                                        <FaTrashAlt />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PostManagement;
