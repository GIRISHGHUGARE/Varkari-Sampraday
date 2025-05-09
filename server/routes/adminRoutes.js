const express = require('express');
const router = express.Router();

// Importing necessary controllers
const adminController = require('../controllers/adminController');

// Admin Routes
router.get('/users', adminController.getUsers); // Get all users
router.get('/products', adminController.getProducts); // Get all products
router.get('/bills', adminController.getBills); // Get all bills
router.get('/posts', adminController.getPosts); // Get all posts
router.get('/stories', adminController.getStories); // Get all stories
router.get('/livetracker', adminController.getAllLiveTrackers); // Get all stories
router.get('/cart', adminController.getCart);
router.get('/cart/:userId', adminController.getCartByUserId);
router.delete('/users/:id', adminController.deleteUser);

router.post('/products', adminController.createProduct); // Create a new product
router.put('/products/:id', adminController.updateProduct); // Update a product
router.delete('/products/:id', adminController.deleteProduct); // Delete a product

router.post('/stories', adminController.createStory); // Create a new story
router.put('/stories/:id', adminController.updateStory); // Update a story
router.delete('/stories/:id', adminController.deleteStory); // Delete a story

router.post('/posts', adminController.createPost); // Create a new post
router.put('/posts/:id', adminController.updatePost); // Update a post
router.delete('/posts/:id', adminController.deletePost); // Delete a post
router.delete('/livetrackers/:id', adminController.deleteLiveTracker); // Delete a live tracker;

router.delete('/bills/:id', adminController.deleteBill);// Delete a Bill

router.put('/cart/update', adminController.updateProductQuantity);
router.delete('/cart/product/:id', adminController.removeProductFromCart);

module.exports = router;
