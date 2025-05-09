import React, { useEffect, useState } from "react";
import client from "../../lib/axios";
import { FaEdit, FaTrashAlt, FaPlusCircle, FaArrowLeft } from "react-icons/fa";
import toast from "react-hot-toast";

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({
        name: "",
        description: "",
        price: "",
        quantity: "",
        productPhoto: "", // for the image URL
    });
    const [editingProduct, setEditingProduct] = useState(null);
    const token = localStorage.getItem("authToken");

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await client.get("/admin/products", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProducts(response.data.products);
        } catch (error) {
            console.error("Error fetching products", error);
        }
    };

    const createProduct = async () => {
        const productData = {
            name: newProduct.name,
            description: newProduct.description,
            price: newProduct.price,
            quantity: newProduct.quantity,
            productPhoto: newProduct.productPhoto,
        };

        try {
            const response = await client.post("/admin/products", productData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            setProducts([...products, response.data]);
            setNewProduct({ name: "", description: "", price: "", quantity: "", productPhoto: "" });
            fetchProducts();
            toast.success("Product created successfully!");
        } catch (error) {
            console.error("Error creating product", error);
            toast.error("Error creating product!");
        }
    };

    const updateProduct = async (id, updatedProduct) => {
        const productData = {
            name: updatedProduct.name || "",
            description: updatedProduct.description || "",
            price: updatedProduct.price || "",
            quantity: updatedProduct.quantity || "",
            productPhoto: updatedProduct.productPhoto || "",
        };

        try {
            const response = await client.put(`/admin/products/${id}`, productData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            setProducts(products.map((product) => (product._id === id ? response.data : product)));
            setEditingProduct(null);
            fetchProducts();
            toast.success("Product updated successfully!");
        } catch (error) {
            console.error("Error updating product", error);
            toast.error("Error updating product!");
        }
    };

    const deleteProduct = async (id) => {
        try {
            await client.delete(`/admin/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProducts(products.filter((product) => product._id !== id));
            fetchProducts();
            toast.success("Product deleted successfully!");
        } catch (error) {
            console.error("Error deleting product", error);
            toast.error("Error deleting product!");
        }
    };

    return (
        <div className="container p-4 mx-auto">
            <h2 className="text-2xl text-center font-semibold mb-6">Product Management</h2>

            {/* Create Product Form */}
            <div className="bg-white border p-4 rounded-lg shadow-lg mb-6">
                <h3 className="text-xl font-semibold mb-4">Add New Product</h3>
                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Product Name"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        className="border p-2 rounded-lg w-full"
                    />
                    <input
                        type="text"
                        placeholder="Product Description"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        className="border p-2 rounded-lg w-full"
                    />
                    <input
                        type="number"
                        placeholder="Product Price"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        className="border p-2 rounded-lg w-full"
                    />
                    <input
                        type="number"
                        placeholder="Quantity"
                        value={newProduct.quantity}
                        onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                        className="border p-2 rounded-lg w-full"
                    />
                    <input
                        type="text"
                        placeholder="Product Image URL"
                        value={newProduct.productPhoto}
                        onChange={(e) => setNewProduct({ ...newProduct, productPhoto: e.target.value })}
                        className="border p-2 rounded-lg w-full"
                    />
                    <button
                        onClick={createProduct}
                        className="flex bg-blue-600 justify-center p-2 rounded-lg text-white w-full hover:bg-blue-700 items-center space-x-2 transition"
                    >
                        <FaPlusCircle />
                        <span>Create Product</span>
                    </button>
                </div>
            </div>

            {/* Edit Product Form */}
            {editingProduct && (
                <div className="bg-white border p-4 rounded-lg shadow-lg mb-6">
                    <h3 className="text-xl font-semibold mb-4">Edit Product</h3>
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Product Name"
                            value={editingProduct.name}
                            onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                            className="border p-2 rounded-lg w-full"
                        />
                        <input
                            type="text"
                            placeholder="Product Description"
                            value={editingProduct.description}
                            onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                            className="border p-2 rounded-lg w-full"
                        />
                        <input
                            type="number"
                            placeholder="Product Price"
                            value={editingProduct.price}
                            onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                            className="border p-2 rounded-lg w-full"
                        />
                        <input
                            type="number"
                            placeholder="Quantity"
                            value={editingProduct.quantity}
                            onChange={(e) => setEditingProduct({ ...editingProduct, quantity: e.target.value })}
                            className="border p-2 rounded-lg w-full"
                        />
                        <input
                            type="text"
                            placeholder="Product Image URL"
                            value={editingProduct.productPhoto}
                            onChange={(e) => setEditingProduct({ ...editingProduct, productPhoto: e.target.value })}
                            className="border p-2 rounded-lg w-full"
                        />
                        <div className="flex space-x-4">
                            <button
                                onClick={() => updateProduct(editingProduct._id, editingProduct)}
                                className="flex bg-green-600 justify-center p-2 rounded-lg text-white items-center space-x-2 transition"
                            >
                                <FaEdit />
                                <span>Update Product</span>
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

            {/* Product List */}
            <div>
                <h3 className="text-xl font-semibold mb-4">Product List</h3>
                {products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <div
                                key={product._id}
                                className="transition-transform transform hover:scale-105 bg-white rounded-lg shadow-lg p-4 flex flex-col justify-between space-y-4 hover:shadow-xl"
                            >
                                <div className="flex flex-col items-center space-y-2">
                                    <img
                                        src={product.productPhoto || "/default-product-image.png"} // Default image if no photo is available
                                        alt={`${product.name} image`}
                                        className="h-32 w-32 object-cover"
                                    />
                                    <div className="text-center">
                                        <span className="text-lg font-semibold text-gray-800">{product.name}</span>
                                        <p className="text-gray-600 text-sm">{product.description}</p>
                                        <p className="text-gray-600 text-sm">Price: ${product.price}</p>
                                        <p className="text-gray-600 text-sm">Quantity: {product.quantity}</p>
                                    </div>
                                </div>
                                <div className="flex justify-between space-x-4 mt-4">
                                    <button
                                        onClick={() => setEditingProduct(product)}
                                        className="text-blue-500 hover:text-blue-600 transition"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => deleteProduct(product._id)}
                                        className="text-red-500 hover:text-red-600 transition"
                                    >
                                        <FaTrashAlt />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No products found.</p>
                )}
            </div>
        </div>
    );
};

export default ProductManagement;
