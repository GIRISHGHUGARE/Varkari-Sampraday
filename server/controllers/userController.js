// PACKAGES
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// FILES
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { sendVerificationEmail, sendResetSuccessEmail, sendVerificationEmailForgotPassword } = require('../services/emailService');

// HANDLING COOKIE FUNCTION
const cookieOptions = {
    httpOnly: true,   // Prevents JavaScript access
    secure: process.env.NODE_ENV === 'production', // Ensure the cookie is only sent over HTTPS in production
    maxAge: 3600000, // 1 hour
    sameSite: 'Strict',  // Adjust based on your cross-origin requirements
};

// VARIABLES
const RESEND_OTP_LIMIT = 3;  // LIMIT ON HOW MANY OTP CAN BE RESENT
const OTP_EXPIRATION_TIME = 1 * 60 * 1000;  // OTP EXPIRATION TIME (1 MINUTE)

const registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate a verification token
        const verificationToken = Math.floor(1000 + Math.random() * 9000).toString();

        // Attempt to send the verification email
        try {
            await sendVerificationEmail({ email, verificationToken });
        } catch (error) {
            return res.status(500).json({ error: 'Error in sending verification email, please retry after some time!' });
        }


        // Create the user object after sending the email
        const user = new User({
            username,
            email,
            password: hashedPassword,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + OTP_EXPIRATION_TIME,
            otpResendTimestamp: Date.now() + OTP_EXPIRATION_TIME,
        });

        // Save the user
        await user.save();

        // Generate a JWT token
        const token = generateToken(user._id);

        // Set JWT token as an HttpOnly cookie
        res.cookie('token', token, cookieOptions);  // Send token as HttpOnly cookie

        // Send success response
        res.status(201).json({
            message: 'User registered successfully',
            token: token,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                profilePhoto: user.profilePhoto,
                summary: user.summary,
                isVerified: user.isVerified
            }
        });

    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// EMAIL VERIFICATION FUNCTION
const verifyEmail = async (req, res) => {
    try {
        const { otp } = req.body;
        const userId = req.user;
        // Fetch user from database
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User  not found" });
        }

        // If the user is already verified, don't resend OTP
        if (user.isVerified) {
            return res.status(400).json({ message: "User  already verified" });
        }
        if (user.verificationToken !== otp || user.verificationTokenExpiresAt < Date.now()) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired verification OTP"
            });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        user.otpResendCount = undefined;
        user.otpResendTimestamp = undefined;
        await user.save();
        return res.status(200).json({
            success: true,
            message: "Email verified successfully"
        });
    } catch (error) {
        console.log("Error in verifying email", error.response?.data || error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// RESEND EMAIL VERIFICATION OTP FUNCTION
const resendVerificationEmail = async (req, res) => {
    try {
        const userId = req.user;
        // Fetch user from database
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // If the user is already verified, don't resend OTP
        if (user.isVerified) {
            return res.status(400).json({ message: "User already verified" });
        }

        // Check if OTP is expired or if resend count is too high
        const currentTime = Date.now();
        const isOtpExpired = user.verificationTokenExpiresAt < currentTime;
        const resendTooSoon = user.otpResendTimestamp && currentTime - user.otpResendTimestamp < OTP_EXPIRATION_TIME; // Check if resend is within 1 minute

        // Prevent user from resending OTP too many times
        if (user.otpResendCount >= RESEND_OTP_LIMIT) {
            return res.status(400).json({ message: "OTP resend limit exceeded" });
        }

        if (isOtpExpired || resendTooSoon) {
            // Generate a new OTP
            const verificationToken = Math.floor(1000 + Math.random() * 9000).toString();
            const expiresAt = Date.now() + OTP_EXPIRATION_TIME; // OTP expiration time

            // Update the user with the new OTP, expiration time, and resend count
            user.verificationToken = verificationToken;
            user.verificationTokenExpiresAt = expiresAt;
            user.otpResendCount += 1; // Increment resend count
            user.otpResendTimestamp = currentTime;  // Update last resend timestamp
            await user.save();
            try {
                // Send the new OTP via email
                await sendVerificationEmail({ email: user.email, verificationToken });

                return res.status(200).json({ message: "New OTP sent successfully" });
            } catch (error) {
                return res.status(500).json({ error: error, message: "Error in Sending Otp" });
            }

        } else {
            // OTP has not expired, or user is trying to resend too soon
            return res.status(400).json({ message: "OTP has expired or you're trying to resend too soon" });
        }
    } catch (error) {
        console.error("Error in resend OTP:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

// LOGIN FUNCTION
const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        // COMPARE PASSWORDS
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        // GENERATE A JWT TOKEN
        const token = generateToken(user._id);

        // SET TOKEN IN HttpOnly cookie
        res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });  // 1 HOUR EXPIRATION

        return res.status(200).json({
            message: 'Login successful',
            token: token,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                profilePhoto: user.profilePhoto,
                summary: user.summary,
                isVerified: user.isVerified,
                isAdmin: user.isAdmin
            }
        });
    } catch (error) {
        console.log("Error in login:", error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// VERIFY USER (PROTECTED ROUTE)
const verifyUser = async (req, res) => {
    try {
        const userId = req.user;  // DECODED userId WHICH IS PASSED FROM AUTHENTICATE MIDDLEWARE
        const user = await User.findById(userId);  // FIND EVERYTHING RELATED TO USER
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "User is authenticated",
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                profilePhoto: user.profilePhoto,
                summary: user.summary,
                isVerified: user.isVerified,
                isAdmin: user.isAdmin
            }
        });
    } catch (error) {
        console.error("Error in verifying user", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

// Search USER (PROTECTED ROUTE)
const searchUser = async (req, res) => {
    try {
        const { username } = req.body;
        const userId = req.user;  // DECODED userId WHICH IS PASSED FROM AUTHENTICATE MIDDLEWARE
        const user = await User.findById(userId);  // FIND EVERYTHING RELATED TO USER
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Search for users with the same username (case-insensitive)
        const users = await User.find({
            username: { $regex: username, $options: "i" },
        });

        return res.status(200).json({
            success: true,
            message: "Users found",
            users: users.map(user => ({
                _id: user._id,
                username: user.username,
                email: user.email,
                profilePhoto: user.profilePhoto,
                summary: user.summary,
                isVerified: user.isVerified
            }))
        });
    } catch (error) {
        console.error("Error in verifying user", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};


//LOGOUT FUNCTION
const logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    })
};

const updateUser = async (req, res) => {
    try {
        const userId = req.user;  // DECODED userId WHICH IS PASSED FROM AUTHENTICATE MIDDLEWARE
        const user = await User.findById(userId);  // FIND EVERYTHING RELATED TO USER
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        const { username, profilePhoto, summary } = req.body;
        const updatedUser = await User.findOneAndUpdate(user._id, {
            username: username,
            profilePhoto: profilePhoto,
            summary: summary
        }, { new: true });
        try {
            const user = await User.findById(userId);
            return res.status(200).send({
                success: true,
                message: "Profile updated",
                user: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    profilePhoto: user.profilePhoto,
                    isVerified: user.isVerified,
                    summary: user.summary
                }
            })
        } catch (error) {

        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "error in update api"
        })
    }
}

const forgotPassword = async (req, res) => {
    const { email } = req.body;  // DECODED userId WHICH IS PASSED FROM AUTHENTICATE MIDDLEWARE
    const user = await User.findOne({ email });  // FIND EVERYTHING RELATED TO USER
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found",
        });
    }
    // Generate a verification token
    const verificationToken = Math.floor(1000 + Math.random() * 9000).toString();

    // Attempt to send the verification email
    try {
        await sendVerificationEmailForgotPassword({ email: user.email, verificationToken });
    } catch (error) {
        return res.status(500).json({ error: 'Error in sending verification email, please retry after some time!' });
    }
    try {
        user.resetPasswordToken = verificationToken;
        user.resetPasswordExpiresAt = Date.now() + OTP_EXPIRATION_TIME;
        await user.save();
        return res.status(200).json({
            success: true,
            message: "Password reset otp sent to your email!"
        });
    } catch (error) {
        console.log("Error in forgotPassword", error);
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
};

const verifyOtpResetPassword = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email }); // again use findOne
        if (!user) {
            return res.status(404).json({ message: "User  not found" });
        }
        if (user.resetPasswordToken !== otp || user.resetPasswordExpiresAt < Date.now()) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired verification OTP"
            });
        }
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
        await user.save();
        return res.status(200).json({
            success: true,
            message: "Email verified successfully!"
        })
    } catch (error) {
        console.log("Error in resetPassword", error);
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
};

const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const user = await User.findOne({ email }); // again use findOne
        if (!user) {
            return res.status(404).json({ message: "User  not found" });
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword
        await user.save();
        await sendResetSuccessEmail({ email: user.email });
        return res.status(200).json({
            success: true,
            message: "Password reset successfully!"
        })
    } catch (error) {
        console.log("Error in resetPassword", error);
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
};
module.exports = { registerUser, verifyEmail, resendVerificationEmail, loginUser, verifyUser, updateUser, searchUser, logout, forgotPassword, resetPassword, verifyOtpResetPassword };
