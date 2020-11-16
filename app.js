// load modules
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const dotenv = require("dotenv");
const colors = require("colors");

// load connection var
const connectDB = require("./config/db");

//load env vars
dotenv.config({ path: "./config/config.env" });

// connect to database
connectDB();

// create express app
const app = express();

// app use installed/default middlewares
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// require all models
require("./models/Bootcamp");

// mount all routes
app.use(require("./routes"));

// mount middleware functions
app.use(require("./middleware/error"));

// export app to server entry point www
module.exports = app;
