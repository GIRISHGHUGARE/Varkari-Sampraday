import { useState } from "react";
import { useDispatch } from "react-redux";
import { FaUser, FaBars, FaSignOutAlt, FaCartPlus, FaBookOpen, FaMoneyBill, FaUpload, FaLocationArrow, FaCartArrowDown } from "react-icons/fa";
import UserManagement from "../../Components/Admin/UserManagement";
import { selectUser, logout } from "../../redux/features/auth/authSlice";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProductManagement from "../../components/Admin/ProductManagement";
import StoriesManagement from "../../components/Admin/StoriesManagement";
import BillManagement from "../../components/Admin/BillManagement";
import PostManagement from "../../components/Admin/PostManagement";
import LiveTrackerManagement from "../../components/Admin/LiveTrackerManagement";
import CartManagement from "../../components/Admin/CartManagement";

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState("user");
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const menuItems = [
        { key: "user", label: "Users", icon: <FaUser /> },
        { key: "product", label: "Products", icon: <FaCartArrowDown /> },
        { key: "story", label: "Stories", icon: <FaBookOpen /> },
        { key: "bill", label: "Bills", icon: <FaMoneyBill /> },
        { key: "post", label: "Posts", icon: <FaUpload /> },
        { key: "tracker", label: "LiveTracker", icon: <FaLocationArrow /> },
        { key: "cart", label: "Cart", icon: <FaCartPlus /> },
    ];

    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem("authToken");
        navigate("/login");
    };

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div className={`bg-gray-100 border-r w-64 p-4 space-y-4 transition-all ${isSidebarOpen ? "block" : "hidden"} md:block`}>
                <h2 className="text-2xl text-center font-semibold">Admin Dashboard</h2>
                <nav className="space-y-2">
                    {menuItems.map((item) => (
                        <button
                            key={item.key}
                            onClick={() => setActiveTab(item.key)}
                            className={`flex items-center space-x-2 p-2 rounded w-full transition ${activeTab === item.key ? "bg-[#9C6536] text-white" : "hover:bg-blue-100"}`}
                        >
                            {item.icon} <span>{item.label}</span>
                        </button>
                    ))}
                </nav>
                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className="flex bg-red-600 p-2 rounded text-white w-full hover:bg-red-700 items-center mt-6 space-x-2 transition"
                >
                    <FaSignOutAlt />
                    <span>Logout</span>
                </button>
            </div>
            {/* Main Content */}
            <div className="flex-1 p-6">
                {/* Toggle Button for Mobile View */}
                <button className="bg-gray-200 p-2 rounded-full md:hidden" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    <FaBars size={24} />
                </button>
                {/* Dynamic Content */}
                <div className="mt-4">
                    {activeTab === "user" && <UserManagement />}
                    {activeTab === "product" && <ProductManagement />}
                    {activeTab === "story" && <StoriesManagement />}
                    {activeTab === "post" && <PostManagement />}
                    {activeTab === "bill" && <BillManagement />}
                    {activeTab === "tracker" && <LiveTrackerManagement />}
                    {activeTab === "cart" && <CartManagement />}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
