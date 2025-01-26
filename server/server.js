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
const userRoutes = require("./routes/userRoutes")
const postRoutes = require("./routes/postRoutes")
const productRoutes = require("./routes/productRoutes")
const LiveTracker = require('./models/LiveTracker'); // Adjust the path as needed


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
    origin: 'http://192.168.0.112:8081',
    methods: ['GET', 'POST'],
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
app.use("/api/v1/post", postRoutes)
app.use("/api/v1/product", productRoutes)

// PORT
const PORT = process.env.PORT || 8080;

// LISTEN
server.listen(PORT, () => {
    console.log(`Server Running on Port ${PORT}`.bgGreen.white);
});