// FILES
const Post = require('../models/Post');
const User = require('../models/User');

const getPost = async (req, res) => {
    try {
        const userId = req.user;  // DECODED userId WHICH IS PASSED FROM AUTHENTICATE MIDDLEWARE
        const user = await User.findById(userId);  // FIND EVERYTHING RELATED TO USER
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Unauthenticated Route!",
            });
        }
        const post = await Post.find().sort({ createdAt: -1 });;
        return res.status(200).json({
            success: true,
            message: "User is authenticated post fetched successfully!",
            post,
        });
    } catch (error) {
        console.error("Error in verifying user", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
}

const addPost = async (req, res) => {
    try {
        const userId = req.user;
        const user = await User.findById(userId);
        const { uploadedPhoto, caption } = req.body;
        if (!user) {
            res.status(404).json({
                success: false,
                message: "Unauthenticated route!!"
            })
        }
        if (!uploadedPhoto || !caption) {
            res.status(500).json({
                success: false,
                message: "Please enter all required fields!"
            })
        }
        const post = new Post({
            uploadedPhoto,
            caption,
            postedByName: user.username,
            postedByProfile: user.profilePhoto,
            postedBy: userId,
        });
        await post.save();
        res.status(201).json({
            success: true,
            message: "Post created successfully!"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error!"
        })
    }
}

const deletePost = async (req, res) => {
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

const updatePost = async (req, res) => {
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
module.exports = { addPost, getPost, deletePost, updatePost }