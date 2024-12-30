const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const colors = require("colors");
const dotenv = require("dotenv");
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const userRoutes = require("./routes/userRoutes")

//DOTENV
dotenv.config();

//MONGODB CONNECTION
connectDB();

//REST OBJECT
const app = express();

//MIDDLEWARES
const corsOptions = {
    origin: 'http://192.168.0.114:8081',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Authorization', 'Content-Type'],
};
app.use(cors(corsOptions));
app.use(cookieParser()); //TO PARSE COOKIE
app.use(express.json());
app.use(morgan("dev"));


//ROUTES
app.get("", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to Varkari Sampraday Server!!"
    });
});
app.use("/api/v1/auth", userRoutes)

//PORT
const PORT = process.env.PORT || 8080;

//LISTEN
app.listen(PORT, () => {
    console.log(`Server Running ${PORT}`.bgGreen.white);
})