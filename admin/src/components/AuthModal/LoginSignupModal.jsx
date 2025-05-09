import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, setLoading, setError } from "../../redux/features/auth/authSlice";
import client from "../../lib/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";

// Add your logo path here
import logo from "../../assets/icon.png";  // Make sure to replace with your actual logo path

const AuthModal = () => {
    const modalRef = useRef();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const loading = useSelector((state) => state.auth.loading);

    const handleSubmit = async () => {
        dispatch(setLoading(true));
        dispatch(setError(null));

        try {
            if (!username || !password) {
                toast.error("Please fill in all fields.");
                return;
            }

            let response;
            response = await client.post("/auth/login", { username, password });
            localStorage.setItem("authToken", response.data.token);
            const isAdmin = response.data.user.isAdmin;
            if (isAdmin) {
                navigate("/admindashboard");
                dispatch(login(response.data.user));
                toast.success("Login successful!");
            } else {
                toast.error("Not valid credentials !!");
                return;
            }
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Action failed"));
            toast.error("Action failed! " + (error.response?.data?.message || ""));
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <div
            className="flex bg-black bg-opacity-40 justify-center backdrop-blur-md fixed inset-0 items-center z-50"
            style={{
                backgroundImage: "url('../Mauli1.png')", // Add background image path here
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <div
                ref={modalRef}
                className="bg-opacity-90 bg-white p-8 rounded-2xl shadow-lg w-full backdrop-blur-lg max-w-lg relative transform transition-transform translate-y-12"
                style={{
                    maxWidth: '450px', // Optional: Adjust modal width if needed
                    margin: '0 auto',
                }}
            >
                {/* Logo */}
                <div className="flex justify-center mb-6">
                    <img
                        src={logo}
                        alt="Logo"
                        className="w-24 h-auto" // Adjust width and height as needed
                    />
                </div>

                <h2 className="text-3xl text-center text-gray-800 font-bold mb-6">
                    Admin Login !!
                </h2>

                <div className="mb-4">
                    <label className="text-gray-700">Username</label>
                    <input
                        type="text"
                        className="border rounded-lg w-full focus:ring-2 focus:ring-blue-400 px-4 py-2 transition"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div className="mb-4 relative">
                    <label className="text-gray-700">Password</label>
                    <input
                        type={showPassword ? "text" : "password"}
                        className="border rounded-lg w-full focus:ring-2 focus:ring-blue-400 px-4 py-2 transition"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <span
                        className="text-gray-600 absolute cursor-pointer hover:text-gray-900 right-3 top-10 transition"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <FaEye /> : <FaEyeSlash />}
                    </span>
                </div>

                <div className="mt-6">
                    <button
                        onClick={handleSubmit}
                        className="rounded-lg shadow-md text-white w-full active:scale-95 font-semibold px-6 py-3 transform transition-transform"
                        style={{
                            background: "linear-gradient(#DDD5AE, #9C6536, #812F21)",
                        }}
                    >
                        {loading ? "Processing..." : "Login"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
