const express = require("express");
const cors = require("cors");

const logger = require("./utils/logger");
const connectDB = require("./utils/db");

const products = require("./data/products");

const app = express();

logger.info("connecting to MongoDB");
connectDB();

app.use(cors());

app.get("/", (request, response) => {
    response.status(200).send("<h1>Hello, World</h1>");
});

app.get("/api/products", (request, response) => {
    response.status(200).json(products);
});

app.get("/api/products/:id", (request, response) => {
    const { id: productId } = request.params;
    const product = products.find((product) => product._id === productId);
    response.status(200).json(product);
});

module.exports = app;
