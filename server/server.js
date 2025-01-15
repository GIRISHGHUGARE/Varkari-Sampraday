// PACKAGES
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const colors = require("colors");
const dotenv = require("dotenv");
const cookieParser = require('cookie-parser');

// FILES
const connectDB = require('./config/db');
const userRoutes = require("./routes/userRoutes")
const postRoutes = require("./routes/postRoutes")

// DOTENV
dotenv.config();

// MONGODB CONNECTION
connectDB();

// REST OBJECT
const app = express();

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

// PORT
const PORT = process.env.PORT || 8080;

// LISTEN
app.listen(PORT, () => {
    console.log(`Server Running ${PORT}`.bgGreen.white);
})