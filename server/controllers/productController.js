const Product = require("../models/Product.js");
const User = require("../models/User.js")

const getProduct = async (req, res) => {
    try {
        const userId = req.user;
        const user = await User.findById(userId);
        if (!user) {
            res.status(500).json({
                success: false,
                message: "unauthenticated route!"
            });
        }
        const product = await Product.find();
        res.status(200).json({
            success: true,
            message: "Product fetched successful",
            product,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error!"
        })
    }
}

const addProduct = async (req, res) => {
    try {
        const userId = req.user;
        const user = await User.findById(userId);
        const { name, description, price, quantity, productPhoto } = req.body;
        if (user.isAdmin) {
            if (!name || !description || !price || !quantity || !productPhoto) {
                res.status(500).json({
                    success: false,
                    message: "Please enter all required fields!"
                })
            }
            const product = new Product({
                name,
                description,
                price,
                quantity,
                productPhoto
            });
            await product.save();
            res.status(201).json({
                success: true,
                message: "Product created successfully!"
            })
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error!"
        })
    }
}

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params
        const userId = req.user;
        const user = await User.findById(userId);
        if (!user) {
            res.status(500).json({
                success: false,
                message: "Unauthenticated route!"
            });
        }
        await Post.findByIdAndDelete({ _id: id });
        res.status(201).json({
            success: true,
            message: 'Post deleted successfully!'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}

const updateProduct = async (req, res) => {
    try {
        const userId = req.user;
        const user = await User.findById(userId);
        const { id } = req.params;
        const { uploadedPhoto, caption } = req.body;
        if (!user) {
            res.status(500).json({
                success: false,
                message: "Unauthenticated route!"
            });
        }
        const updatedPost = await Post.findByIdAndUpdate(
            {
                _id: id
            },
            {
                uploadedPhoto: uploadedPhoto,
                caption: caption
            },
            {
                new: true
            }
        );
        res.status(200).json({
            success: true,
            message: "Post updated successfully!"
        });
    } catch (error) {
        res.status(200).json({
            success: false,
            message: "Server Error!"
        });
    }
}

module.exports = { getProduct, addProduct, deleteProduct, updateProduct }