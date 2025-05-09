import React, { useEffect, useState } from "react";
import client from "../../lib/axios";
import { FaTrashAlt } from "react-icons/fa";
import toast from 'react-hot-toast';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({ username: "", email: "", password: "" });
    const [editingUser, setEditingUser] = useState(null);
    const token = localStorage.getItem("authToken");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await client.get("/admin/users", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(response.data.users);
        } catch (error) {
            console.error("Error fetching users", error);
        }
    };

    const createUser = async () => {
        try {
            const response = await client.post("/admin/users", newUser, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers([...users, response.data]);
            setNewUser({ username: "", email: "", password: "" });
            toast.success("User created successfully!");
        } catch (error) {
            console.error("Error creating user", error);
            toast.error("Error creating user!");
        }
    };

    // const updateUser = async (id, updatedUser) => {
    //     try {
    //         const response = await client.put(`/admin/users/${id}`, updatedUser, {
    //             headers: { Authorization: `Bearer ${token}` },
    //         });
    //         setUsers(users.map((user) => (user._id === id ? response.data : user)));
    //         setEditingUser(null);
    //         toast.success("User updated successfully!");
    //     } catch (error) {
    //         console.error("Error updating user", error);
    //         toast.error("Error updating user!");
    //     }
    // };

    const deleteUser = async (id) => {
        try {
            await client.delete(`/admin/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(users.filter((user) => user._id !== id));
            toast.success("User deleted successfully!");
        } catch (error) {
            console.error("Error deleting user", error);
            toast.error("Error deleting user!");
        }
    };

    return (
        <div className="container p-4 mx-auto">
            <h2 className="text-2xl text-center font-semibold mb-6">User Management</h2>

            {/* Create User Form */}
            {/* <div className="bg-white border p-4 rounded-lg shadow-lg mb-6">
                <h3 className="text-xl font-semibold mb-4">Add New User</h3>
                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Username"
                        value={newUser.username}
                        onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                        className="border p-2 rounded-lg w-full"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        className="border p-2 rounded-lg w-full"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        className="border p-2 rounded-lg w-full"
                    />
                    <button
                        onClick={createUser}
                        className="flex bg-blue-600 justify-center p-2 rounded-lg text-white w-full hover:bg-blue-700 items-center space-x-2 transition"
                    >
                        <FaPlusCircle />
                        <span>Create User</span>
                    </button>
                </div>
            </div> */}

            {/* Edit User Form */}
            {/* {editingUser && (
                <div className="bg-white border p-4 rounded-lg shadow-lg mb-6">
                    <h3 className="text-xl font-semibold mb-4">Edit User</h3>
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Username"
                            value={editingUser.username}
                            onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                            className="border p-2 rounded-lg w-full"
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={editingUser.email}
                            onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                            className="border p-2 rounded-lg w-full"
                        />
                        <button
                            onClick={() => updateUser(editingUser._id, editingUser)}
                            className="flex bg-blue-600 justify-center p-2 rounded-lg text-white w-full hover:bg-blue-700 items-center space-x-2 transition"
                        >
                            <FaEdit />
                            <span>Update User</span>
                        </button>
                    </div>
                </div>
            )} */}

            {/* User List */}
            <div>
                <h3 className="text-xl font-semibold mb-4">User List</h3>
                {users.length > 0 ? (
                    <div className="space-y-4">
                        {users.map((user) => (
                            <div key={user._id} className="flex bg-white border justify-between p-4 rounded-lg shadow-md items-center">
                                <div className="flex items-center">
                                    <img
                                        src={user.profilePhoto} // Ensure you have the profile photo URL from the backend
                                        alt={`${user.username}'s profile`}
                                        className="h-12 rounded-full w-12 mr-4"
                                    />
                                    <div>
                                        <span className="text-lg font-semibold">{user.username}</span>
                                        <p className="text-gray-600 text-sm">{user.email}</p>
                                        <p className="text-gray-600 text-sm">{user.role}</p>
                                    </div>
                                </div>
                                <div className="flex space-x-4">
                                    <button
                                        onClick={() => deleteUser(user._id)}
                                        className="text-red-500 hover:text-red-600 transition"
                                    >
                                        <FaTrashAlt />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No users found.</p>
                )}
            </div>
        </div>
    );
};

export default UserManagement;
