// FILES
const Post = require('../models/Post');

export const addPost = async (req, res) => {
    try {
        const userId = req.user;  // DECODED userId WHICH IS PASSED FROM AUTHENTICATE MIDDLEWARE
        const user = await User.findById(userId);  // FIND EVERYTHING RELATED TO USER
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Unauthenticated Route!",
            });
        }
        const post = await Post.find();
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

export const getPost = async (req, res) => {

}

module.exports = { addPost, getPost }