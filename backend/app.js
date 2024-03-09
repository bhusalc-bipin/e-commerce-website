const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const logger = require("./utils/logger");
const connectDB = require("./utils/db");
const {
    errorHandler,
    unknownEndpoint,
} = require("./middleware/errorMiddleware");
const productsRouter = require("./routes/productRoutes");
const usersRouter = require("./routes/userRoutes");

const app = express();

logger.info("connecting to MongoDB");
connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/products", productsRouter);
app.use("/api/users", usersRouter);

app.use(errorHandler);
app.use(unknownEndpoint);

module.exports = app;
