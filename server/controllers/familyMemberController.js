// FILES
const FamilyMember = require('../models/FamilyMember');
const User = require('../models/User');

const getfamilyMember = async (req, res) => {
    try {
        const userId = req.user;  // DECODED userId WHICH IS PASSED FROM AUTHENTICATE MIDDLEWARE
        const user = await User.findById(userId);  // FIND EVERYTHING RELATED TO USER
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Unauthenticated Route!",
            });
        }
        const familyMember = await FamilyMember.find();
        return res.status(200).json({
            success: true,
            message: "User is authenticated post fetched successfully!",
            familyMember,
        });
    } catch (error) {
        console.error("Error in verifying user", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
}

const addfamilyMember = async (req, res) => {
    try {
        const userId = req.user;
        const user = await User.findById(userId);
        const { name, relationship, contactinfo } = req.body;
        if (!user) {
            res.status(404).json({
                success: false,
                message: "Unauthenticated route!!"
            })
        }
        if (!name || !relationship || !contactinfo) {
            res.status(500).json({
                success: false,
                message: "Please enter all required fields!"
            })
        }
        const familyMember = new FamilyMember({
            name,
            relationship,
            contactinfo,
            addedBy: userId,
        });
        await familyMember.save();
        res.status(201).json({
            success: true,
            message: "Family Member Added successfully!"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error!"
        })
    }
}

const deletefamilyMember = async (req, res) => {
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
        await FamilyMember.findByIdAndDelete({ _id: id });
        res.status(201).json({
            success: true,
            message: 'Family Member deleted successfully!'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}

const updatefamilyMember = async (req, res) => {
    try {
        const userId = req.user;
        const user = await User.findById(userId);
        const { id } = req.params;
        const { name, relationship, contactinfo } = req.body;
        if (!user) {
            res.status(500).json({
                success: false,
                message: "Unauthenticated route!"
            });
        }
        const updatedfamilyMember = await FamilyMember.findByIdAndUpdate(
            {
                _id: id
            },
            {
                name: name,
                relationship: relationship,
                contactinfo: contactinfo,
            },
            {
                new: true
            }
        );
        res.status(200).json({
            success: true,
            message: "Family member updated successfully!"
        });
    } catch (error) {
        res.status(200).json({
            success: false,
            message: "Server Error!"
        });
    }
}
module.exports = { addfamilyMember, getfamilyMember, deletefamilyMember, updatefamilyMember }