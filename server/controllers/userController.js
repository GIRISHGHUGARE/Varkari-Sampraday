const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const generateToken = require('../utils/generateToken');  // Import the generateToken utility
const { sendVerificationEmail } = require('../services/emailService');

const cookieOptions = {
    httpOnly: true,   // Prevents JavaScript access
    secure: process.env.NODE_ENV === 'production', // Ensure the cookie is only sent over HTTPS in production
    maxAge: 3600000, // 1 hour
    sameSite: 'Strict',  // Adjust based on your cross-origin requirements
};
const RESEND_OTP_LIMIT = 3;  // Limit on how many times OTP can be resent
const OTP_EXPIRATION_TIME = 24 * 60 * 60 * 1000;  // OTP expiration time (24 hours)

// REGISTER FUNCTION
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
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        // Create the user
        const user = new User({
            username,
            email,
            password: hashedPassword,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
        });
        await user.save();

        // Generate a JWT token
        const token = generateToken(user._id);

        // Set JWT token as an HttpOnly cookie
        res.cookie('token', token, cookieOptions);  // Send token as HttpOnly cookie

        console.log('User email:', user.email);
        //SEND VERIFICATION EMAIL
        await sendVerificationEmail({ email: user.email, verificationToken });

        // Send response without the token
        res.status(201).json({
            message: 'User registered successfully',
            user: {
                ...user._doc,
                password: undefined,
            }
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

const verifyEmail = async (req, res) => {
    const { code } = req.body;
    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() }
        })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired verification code"
            })
        }
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();
        return res.status(200).json({
            success: true,
            message: "Email verified successfully"
        })
    } catch (error) {
        console.log("Error in verifying email", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
};

const resendVerificationEmail = async (req, res) => {
    try {
        // Extract the user ID from the JWT token in the header (assuming the token is sent in the request header)
        const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: "Authorization token missing" });
        }

        // Decode the JWT token to get user ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.user._id;

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
        const resendTooSoon = user.otpResendTimestamp && currentTime - user.otpResendTimestamp < 60000; // Check if resend is within 1 minute

        // Prevent user from resending OTP too many times
        if (user.otpResendCount >= RESEND_OTP_LIMIT) {
            return res.status(400).json({ message: "OTP resend limit exceeded" });
        }

        if (isOtpExpired || resendTooSoon) {
            // Generate a new OTP
            const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
            const expiresAt = Date.now() + OTP_EXPIRATION_TIME; // OTP expiration time

            // Update the user with the new OTP, expiration time, and resend count
            user.verificationToken = verificationToken;
            user.verificationTokenExpiresAt = expiresAt;
            user.otpResendCount += 1; // Increment resend count
            user.otpResendTimestamp = currentTime;  // Update last resend timestamp
            await user.save();

            // Send the new OTP via email
            await sendVerificationEmail(user.email, verificationToken);

            return res.status(200).json({ message: "New OTP sent successfully" });
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
        // Find the user by username (or email, depending on your authentication method)
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        // Generate a JWT token
        const token = generateToken(user._id);

        // Set token in HttpOnly cookie (optional, or you could return it in response)
        res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });  // 1 hour expiration

        // Send the response with a success message and the user (without password)
        return res.status(200).json({
            message: 'Login successful',
            token: token,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                isVerified: user.isVerified
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
        const userId = req.user;  // The user id is decoded from the token in the middleware
        const user = await User.findById(userId);  // Find the full user data in the database
        console.log("Verified User ID :", userId)
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
                isVerified: user.isVerified,
            },
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

module.exports = { registerUser, verifyEmail, resendVerificationEmail, loginUser, verifyUser, logout };
