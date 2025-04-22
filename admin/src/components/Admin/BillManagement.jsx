import React, { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt, FaArrowLeft } from "react-icons/fa";
import toast from "react-hot-toast";
import client from "../../lib/axios";

const BillManagement = () => {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingBill, setEditingBill] = useState(null);
    const token = localStorage.getItem("authToken");

    useEffect(() => {
        fetchBills();
    }, []);

    const fetchBills = async () => {
        try {
            const response = await client.get("/admin/bills", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setBills(response.data.bills);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching bills", error);
            setLoading(false);
        }
    };

    const deleteBill = async (id) => {
        try {
            await client.delete(`/admin/bills/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setBills(bills.filter((bill) => bill._id !== id));
            fetchBills();
            toast.success("Bill deleted successfully!");
        } catch (error) {
            console.error("Error deleting bill", error);
            toast.error("Error deleting bill!");
        }
    };

    const updateBill = async (id, updatedBill) => {
        try {
            const response = await client.put(`/admin/bills/${id}`, updatedBill, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setBills(bills.map((bill) => (bill._id === id ? response.data : bill)));
            fetchBills();
            setEditingBill(null);
            toast.success("Bill updated successfully!");
        } catch (error) {
            console.error("Error updating bill", error);
            toast.error("Error updating bill!");
        }
    };

    return (
        <div className="container p-4 mx-auto">
            <h2 className="text-2xl font-semibold text-center mb-6">Bill Management</h2>

            {/* Edit Bill Form */}
            {editingBill && (
                <div className="bg-white border p-4 rounded-lg shadow-lg mb-6">
                    <h3 className="text-xl font-semibold mb-4">Edit Bill</h3>
                    {/* Bill Edit Form goes here */}
                    {/* You can add the necessary fields like "Total Amount", "Shipping Fee", etc. */}
                    <button
                        onClick={() => updateBill(editingBill._id, editingBill)}
                        className="flex bg-green-600 text-white p-2 rounded-lg justify-center space-x-2 items-center hover:bg-green-700 transition"
                    >
                        <FaEdit />
                        <span>Update Bill</span>
                    </button>
                    <button
                        onClick={() => setEditingBill(null)}
                        className="flex bg-gray-600 text-white p-2 rounded-lg justify-center space-x-2 items-center hover:bg-gray-700 transition mt-4"
                    >
                        <FaArrowLeft />
                        <span>Cancel</span>
                    </button>
                </div>
            )}

            {/* Bill List */}
            <div>
                <h3 className="text-xl font-semibold mb-4">Bill List</h3>
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {bills.map((bill) => (
                            <div
                                key={bill._id}
                                className="transition-transform transform hover:scale-105 bg-white rounded-lg shadow-lg p-4 flex flex-col justify-between space-y-4 hover:shadow-xl"
                            >
                                <div>
                                    <h4 className="font-semibold">{bill.user.name}</h4>
                                    <p className="text-gray-600">Total Amount: ${bill.totalAmount}</p>
                                    <p className="text-gray-600">Status: {bill.status}</p>
                                </div>
                                <div className="flex justify-between space-x-4 mt-4">
                                    <button
                                        onClick={() => setEditingBill(bill)}
                                        className="text-blue-500 hover:text-blue-600 transition"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => deleteBill(bill._id)}
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

export default BillManagement;
