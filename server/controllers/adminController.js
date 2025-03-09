const Product = require('../models/Product');
const User = require('../models/User');
const Bill = require('../models/Bill');
const Post = require('../models/Post');
const Story = require('../models/Story');

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
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { name, description, price, quantity, productPhoto },
            { new: true }
        );
        if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
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
