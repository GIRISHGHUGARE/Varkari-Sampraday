import React, { useEffect, useState } from "react";
import client from "../../lib/axios";
import { FaTrashAlt, FaEdit, FaArrowLeft } from "react-icons/fa";
import toast from "react-hot-toast";

const CartManagement = () => {
    const [carts, setCarts] = useState([]); // Holds multiple carts
    const [editingProduct, setEditingProduct] = useState(null);
    const [updatedQuantity, setUpdatedQuantity] = useState(0);
    const token = localStorage.getItem("authToken");
    console.log(editingProduct)
    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const response = await client.get(`/admin/cart/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCarts(response.data); // Assuming response.data is an array of cart objects
            console.log(response.data)
        } catch (error) {
            console.error("Error fetching cart", error);
        }
    };

    const updateProductQuantity = async () => {
        if (!editingProduct || !editingProduct.user || !editingProduct.product) {
            toast.error("Selected product or user is missing.");
            return;
        }

        const updatedProduct = {
            userId: editingProduct.user._id, // Ensure editingProduct contains the user object
            productId: editingProduct.product._id, // Ensure editingProduct contains the product object
            quantity: updatedQuantity,
        };

        try {
            const response = await client.put("/admin/cart/update", updatedProduct, {
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            });
            setCarts(response.data);
            fetchCart();
            setEditingProduct(null); // Reset editing state after update
            toast.success("Product quantity updated!");
        } catch (error) {
            console.error("Error updating product quantity", error);
            toast.error("Error updating product quantity!");
        }
    };


    const removeProductFromCart = async (productId) => {
        try {
            const response = await client.delete(`/admin/cart/product/${productId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCarts(response.data);
            fetchCart();
            toast.success("Product removed from cart!");
        } catch (error) {
            console.error("Error removing product from cart", error);
            toast.error("Error removing product from cart!");
        }
    };

    return (
        <div className="container p-4 mx-auto">
            <h2 className="text-2xl text-center font-semibold mb-6">Cart Management</h2>

            {/* Cart Items with User Details */}
            <div>
                <h3 className="text-xl font-semibold mb-4">All Carts</h3>
                {carts.length > 0 ? (
                    <div>
                        {carts.map((cart) => (
                            <div key={cart._id} className="mb-6">
                                <div className="bg-white border p-4 rounded-lg shadow-lg">
                                    <h4 className="text-lg font-semibold mb-2">User: {cart.user.email}</h4>
                                    <div className="space-y-4">
                                        {cart.products.length > 0 ? (
                                            cart.products.map((item) => (
                                                <div key={item.product._id} className="flex justify-between items-center">
                                                    <div>
                                                        <span className="font-semibold">{item.product.name}</span>
                                                        <p>Quantity: {item.quantity}</p>
                                                    </div>
                                                    <div className="flex space-x-4">
                                                        <button
                                                            onClick={() => setEditingProduct({ user: cart.user, product: item.product })}
                                                            className="text-blue-500 hover:text-blue-600 transition"
                                                        >
                                                            <FaEdit />
                                                        </button>
                                                        <button
                                                            onClick={() => removeProductFromCart(item.product._id)}
                                                            className="text-red-500 hover:text-red-600 transition"
                                                        >
                                                            <FaTrashAlt />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p>No products in this cart.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No carts found.</p>
                )}
            </div>

            {/* Edit Product Quantity */}
            {editingProduct && (
                <div className="bg-white border p-4 rounded-lg shadow-lg mb-6">
                    <h3 className="text-xl font-semibold mb-4">Edit Product Quantity</h3>
                    <div className="space-y-4">
                        <input
                            type="number"
                            placeholder="New Quantity"
                            value={updatedQuantity}
                            onChange={(e) => setUpdatedQuantity(e.target.value)}
                            className="border p-2 rounded-lg w-full"
                        />
                        <div className="flex space-x-4">
                            <button
                                onClick={updateProductQuantity}
                                className="flex bg-green-600 justify-center p-2 rounded-lg text-white items-center space-x-2 transition"
                            >
                                <FaEdit />
                                <span>Update Quantity</span>
                            </button>
                            <button
                                onClick={() => setEditingProduct(null)}
                                className="flex bg-gray-600 justify-center p-2 rounded-lg text-white items-center space-x-2 transition"
                            >
                                <FaArrowLeft />
                                <span>Cancel</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartManagement;
