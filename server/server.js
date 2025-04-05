// PACKAGES
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const colors = require("colors");
const dotenv = require("dotenv");
const cookieParser = require('cookie-parser');
const { Server } = require("socket.io");
const http = require("http");

// FILES
const connectDB = require('./config/db');
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const productRoutes = require("./routes/productRoutes");
const storyRoutes = require("./routes/storyRoutes");
const cartRoutes = require('./routes/cartRoutes');
const adminRoutes = require('./routes/adminRoutes')
const LiveTracker = require('./models/LiveTracker');


// DOTENV
dotenv.config();

// MONGODB CONNECTION
connectDB();

// REST OBJECT
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

// MIDDLEWARES
const corsOptions = {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Authorization', 'Content-Type'],
};
app.use(cors(corsOptions));
app.use(cookieParser()); // TO PARSE COOKIE
app.use(express.json());
app.use(morgan("dev")); // TO HAVE CONSOLE LOGS SUCCESS AND ERROR

// SOCKET.IO CONNECTION
io.on("connection", (socket) => {
    console.log(`New client connected: ${socket.id}`);

    socket.on("updateLocation", async (data) => {
        try {
            const { userId, latitude, longitude } = data;

            if (!userId || !latitude || !longitude) {
                throw new Error("Invalid location data");
            }

            const tracker = await LiveTracker.findOneAndUpdate(
                { user: userId },
                {
                    user: userId,
                    currentLocation: { latitude, longitude },
                    timestamp: Date.now(),
                },
                { upsert: true, new: true }
            );

            io.emit("locationUpdated", {
                userId,
                currentLocation: { latitude, longitude },
            });

            console.log("Location updated:", tracker);
        } catch (err) {
            console.error("Error updating location:", err.message);
        }
    });
    // Listen for "getLocation" event from clients (e.g., family member requesting a location)
    socket.on('getLocation', async (userId) => {
        try {
            // Fetch the user's last known location from MongoDB (LiveTracker model)
            const userLocation = await LiveTracker.findOne({ user: userId });

            if (userLocation) {
                // Emit the location to the requesting client
                socket.emit("locationUpdated", {
                    user: userId,
                    currentLocation: userLocation.currentLocation
                });

                console.log(`Location sent for user ${userId}:`, userLocation.currentLocation);
            } else {
                // If no location found (e.g., user hasn't updated location yet)
                socket.emit("locationUpdated", {
                    user: userId,
                    currentLocation: null
                });

                console.log(`No location found for user ${userId}`);
            }
        } catch (error) {
            console.error("Error fetching location from database:", error);
        }
    });
    socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});

// MAIN ROUTE
app.get("", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to Varkari Sampraday Server!!"
    });
});

// OTHER ROUTES
app.use("/api/v1/auth", userRoutes)
app.use("/api/v1/admin", adminRoutes)
app.use("/api/v1/post", postRoutes)
app.use("/api/v1/product", productRoutes)
app.use("/api/v1/story", storyRoutes)
app.use("/api/v1/cart", cartRoutes)

// PORT
const PORT = process.env.PORT || 8080;

// LISTEN
server.listen(PORT, () => {
    console.log(`Server Running on Port ${PORT}`.bgGreen.white);
});