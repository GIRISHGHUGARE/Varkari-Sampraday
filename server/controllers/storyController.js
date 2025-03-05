const Story = require("../models/Story.js");
const User = require("../models/User.js")

const getStory = async (req, res) => {
    try {
        const userId = req.user;
        const user = await User.findById(userId);
        if (!user) {
            res.status(500).json({
                success: false,
                message: "unauthenticated route!"
            });
        }
        const story = await Story.find();
        res.status(200).json({
            success: true,
            message: "Story fetched successful",
            story,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error!"
        })
    }
}

const addStory = async (req, res) => {
    try {
        const userId = req.user;
        const user = await User.findById(userId);
        const { title, storyPhoto, content } = req.body;
        if (user.isAdmin) {
            if (!title || !content) {
                res.status(500).json({
                    success: false,
                    message: "Please enter all required fields!"
                })
            }
            const story = new Story({
                title,
                storyPhoto,
                content
            });
            await story.save();
            res.status(201).json({
                success: true,
                message: "Story created successfully!"
            })
        }
        res.status(500).json({
            success: false,
            message: 'Unauthenticated route!'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error!"
        })
    }
}

const deleteStory = async (req, res) => {
    try {
        const { id } = req.params
        const userId = req.user;
        const user = await User.findById(userId);
        if (user.isAdmin) {
            await Story.findByIdAndDelete({ _id: id });
            res.status(201).json({
                success: true,
                message: 'Product deleted successfully!'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Unauthenticated route!'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}

const updateStory = async (req, res) => {
    try {
        const userId = req.user;
        const user = await User.findById(userId);
        const { id } = req.params;
        const { title, storyPhoto, content } = req.body;
        if (user.isAdmin) {
            const updatedStory = await Story.findByIdAndUpdate(
                {
                    _id: id
                },
                {
                    title: title,
                    storyPhoto: storyPhoto,
                    content: content,
                },
                {
                    new: true
                }
            );
            res.status(200).json({
                success: true,
                message: "Story updated successfully!"
            });
        }
        res.status(500).json({
            success: false,
            message: "Unauthenticated route!"
        });
    } catch (error) {
        res.status(200).json({
            success: false,
            message: "Server Error!"
        });
    }
}

module.exports = { getStory, addStory, deleteStory, updateStory }