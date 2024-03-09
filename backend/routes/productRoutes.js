const productsRouter = require("express").Router();

const Product = require("../models/productModel");
const asyncHandler = require("../middleware/asyncHandler");

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
productsRouter.get(
    "/",
    asyncHandler(async (request, response) => {
        const products = await Product.find({});
        response.status(200).json(products);
    })
);

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
productsRouter.get(
    "/:id",
    asyncHandler(async (request, response) => {
        const product = await Product.findById(request.params.id);
        if (product) {
            return response.status(200).json(product);
        }
        response.status(404);
        throw new Error("Resource not found");
    })
);

module.exports = productsRouter;
