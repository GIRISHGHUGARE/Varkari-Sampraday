const Product = require('../models/Product');
const User = require('../models/User');
const Bill = require('../models/Bill');
const Post = require('../models/Post');
const Story = require('../models/Story');
const Cart = require('../models/Cart');
const LiveTracker = require('../models/LiveTracker');

// Get all users
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving users' });
    }
};
// delete users
exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting user' });
    }
};
// Get all products
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({ products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving products' });
    }
};

// Create a new product
exports.createProduct = async (req, res) => {
    const { name, description, price, quantity, productPhoto } = req.body;
    try {
        const newProduct = new Product({ name, description, price, quantity, productPhoto });
        await newProduct.save();
        res.status(201).json({ message: 'Product created successfully', product: newProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating product' });
    }
};

// Update a product
exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, description, price, quantity, productPhoto } = req.body;
    console.log("Received Product Data:", { name, description, price, quantity, productPhoto });
    try {
        // Find the product by id
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        // Update only the fields that are passed in the request body
        if (name !== undefined) product.name = name;
        if (description !== undefined) product.description = description;
        if (price !== undefined) product.price = price;
        if (quantity !== undefined) product.quantity = quantity;
        if (productPhoto !== undefined) product.productPhoto = productPhoto;

        // Save the updated product
        const updatedProduct = await product.save();

        res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating product' });
    }
};


// Delete a product
exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting product' });
    }
};

// Get all bills
exports.getBills = async (req, res) => {
    try {
        const bills = await Bill.find().populate('user').populate('cart');
        res.status(200).json({ bills });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving bills' });
    }
};

// Delete a product
exports.deleteBill = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedBill = await Bill.findByIdAndDelete(id);
        if (!deletedBill) return res.status(404).json({ message: 'Bill not found' });
        res.status(200).json({ message: 'Bill deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting product' });
    }
};
// Get all posts
exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('postedBy');
        res.status(200).json({ posts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving posts' });
    }
};

// Create a new post
exports.createPost = async (req, res) => {
    const { uploadedPhoto, caption, postedByName, postedByProfile, postedBy } = req.body;
    try {
        const newPost = new Post({ uploadedPhoto, caption, postedByName, postedByProfile, postedBy });
        await newPost.save();
        res.status(201).json({ message: 'Post created successfully', post: newPost });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating post' });
    }
};

// Update a post
exports.updatePost = async (req, res) => {
    const { id } = req.params;
    const { uploadedPhoto, caption, postedByName, postedByProfile } = req.body;
    try {
        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { uploadedPhoto, caption, postedByName, postedByProfile },
            { new: true }
        );
        if (!updatedPost) return res.status(404).json({ message: 'Post not found' });
        res.status(200).json({ message: 'Post updated successfully', post: updatedPost });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating post' });
    }
};

// Delete a post
exports.deletePost = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedPost = await Post.findByIdAndDelete(id);
        if (!deletedPost) return res.status(404).json({ message: 'Post not found' });
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting post' });
    }
};

// Get all stories
exports.getStories = async (req, res) => {
    try {
        const stories = await Story.find();
        res.status(200).json({ stories });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving stories' });
    }
};

// Create a new story
exports.createStory = async (req, res) => {
    const { title, storyPhoto, content } = req.body;
    try {
        const newStory = new Story({ title, storyPhoto, content });
        await newStory.save();
        res.status(201).json({ message: 'Story created successfully', story: newStory });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating story' });
    }
};

// Update a story
exports.updateStory = async (req, res) => {
    const { id } = req.params;
    const { title, storyPhoto, content } = req.body;
    try {
        const updatedStory = await Story.findByIdAndUpdate(
            id,
            { title, storyPhoto, content },
            { new: true }
        );
        if (!updatedStory) return res.status(404).json({ message: 'Story not found' });
        res.status(200).json({ message: 'Story updated successfully', story: updatedStory });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating story' });
    }
};

// Delete a story
exports.deleteStory = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedStory = await Story.findByIdAndDelete(id);
        if (!deletedStory) return res.status(404).json({ message: 'Story not found' });
        res.status(200).json({ message: 'Story deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting story' });
    }
};



// Create a new live tracker entry
exports.createLiveTracker = async (req, res) => {
    const { user, currentLocation } = req.body;
    try {
        const newLiveTracker = new LiveTracker({ user, currentLocation });
        await newLiveTracker.save();
        res.status(201).json({ message: 'Live Tracker entry created successfully', liveTracker: newLiveTracker });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating live tracker entry' });
    }
};

// Get all live tracker entries
exports.getAllLiveTrackers = async (req, res) => {
    try {
        const liveTrackers = await LiveTracker.find().populate('user');
        res.status(200).json({ liveTrackers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving live trackers' });
    }
};


// Get a specific live tracker entry by ID
exports.getLiveTrackerById = async (req, res) => {
    const { id } = req.params;
    try {
        const liveTracker = await LiveTracker.findById(id).populate('user');
        if (!liveTracker) {
            return res.status(404).json({ message: 'Live tracker not found' });
        }
        res.status(200).json({ liveTracker });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving live tracker entry' });
    }
};

// Update a live tracker entry
exports.updateLiveTracker = async (req, res) => {
    const { id } = req.params;
    const { currentLocation } = req.body;
    try {
        const liveTracker = await LiveTracker.findById(id);
        if (!liveTracker) return res.status(404).json({ message: 'Live tracker not found' });

        // Update currentLocation if provided
        if (currentLocation) {
            liveTracker.currentLocation = currentLocation;
        }

        const updatedLiveTracker = await liveTracker.save();
        res.status(200).json({ message: 'Live tracker entry updated successfully', liveTracker: updatedLiveTracker });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating live tracker entry' });
    }
};

// Delete a live tracker entry
exports.deleteLiveTracker = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedLiveTracker = await LiveTracker.findByIdAndDelete(id);
        if (!deletedLiveTracker) return res.status(404).json({ message: 'Live tracker not found' });
        res.status(200).json({ message: 'Live tracker entry deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting live tracker entry' });
    }
};

// Get Cart by User ID (for admin to view any cart)
exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.find({}).populate('user', 'name email').populate('products.product', 'name price');
        res.status(200).json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while retrieving carts." });
    }
};
// Get a single cart by user ID (specific to admin view)
exports.getCartByUserId = async (req, res) => {
    try {
        const { userId } = req.params; // get userId from route params
        const cart = await Cart.findOne({ user: userId }).populate('products.product', 'name price');
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found for this user.' });
        }
        res.status(200).json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while retrieving the user's cart." });
    }
};

// Update product quantity in the cart
exports.updateProductQuantity = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found.' });
        }

        const product = cart.products.find(item => item.product.toString() === productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found in cart.' });
        }

        // Update the product quantity and total
        product.quantity = quantity;
        product.total = product.quantity * product.price;

        await cart.save();

        res.status(200).json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while updating the cart." });
    }
};

// Remove product from cart
exports.removeProductFromCart = async (req, res) => {
    try {
        const { id } = req.params; // Get product ID from request parameters

        // Find the cart containing the product
        const cart = await Cart.findOne({ "products.product": id });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found.' });
        }

        // Remove product from the cart
        cart.products = cart.products.filter(item => item.product.toString() !== id);

        // Save the updated cart
        await cart.save();

        res.status(200).json(cart); // Return updated cart
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while removing the product from the cart." });
    }
};
