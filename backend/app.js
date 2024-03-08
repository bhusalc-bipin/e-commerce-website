const express = require("express");
const cors = require("cors");

const logger = require("./utils/logger");
const connectDB = require("./utils/db");
const {
    errorHandler,
    unknownEndpoint,
} = require("./middleware/errorMiddleware");
const productsRouter = require("./routes/productRoutes");

const app = express();

logger.info("connecting to MongoDB");
connectDB();

app.use(cors());
app.use("/api/products", productsRouter);

app.use(errorHandler);
app.use(unknownEndpoint);

module.exports = app;
