const express = require("express");
const products = require("./data/products");

const app = express();

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
