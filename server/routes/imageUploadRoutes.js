const cloudinary = require('cloudinary').v2;
const express = require('express');
const router = express.Router();
const dotenv = require("dotenv")

dotenv.config()

// Configure Cloudinary with your Cloudinary credentials
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

// Route to handle image upload to Cloudinary
router.post('/upload-image', async (req, res) => {
    try {
        // Assuming you send image as 'image' from the frontend
        const file = req.files.image; // You'll need a file upload middleware like 'multer' for file handling
        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const uploadResponse = await cloudinary.uploader.upload(file.tempFilePath, {
            folder: 'profile_pictures', // Optional, to categorize images
            public_id: `profile_${Date.now()}`, // You can customize this as needed
        });

        // Send back the URL of the uploaded image
        res.json({ imageUrl: uploadResponse.secure_url });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to upload image to Cloudinary' });
    }
});

module.exports = router;
