const productsRouter = require("express").Router();

const Product = require("../models/productModel");
const asyncHandler = require("../middleware/asyncHandler");
const {
    verifyUserLoggedIn,
    verifyAdminAccess,
} = require("../middleware/authMiddleware");

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

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
productsRouter.post(
    "/",
    verifyUserLoggedIn,
    verifyAdminAccess,
    asyncHandler(async (request, response) => {
        const product = new Product({
            name: "Sample name",
            price: 0,
            seller: request.user._id,
            image: "/images/sample.jpg",
            brand: "Sample brand",
            category: "Sample category",
            countInStock: 0,
            numReviews: 0,
            description: "Sample description",
        });

        const createdProduct = await product.save();
        response.status(200).json(createdProduct);
    })
);

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
productsRouter.put(
    "/:id",
    verifyUserLoggedIn,
    verifyAdminAccess,
    asyncHandler(async (request, response) => {
        const {
            name,
            price,
            description,
            image,
            brand,
            category,
            countInStock,
        } = request.body;

        const product = await Product.findById(request.params.id);

        if (product) {
            product.name = name;
            product.price = price;
            product.description = description;
            product.image = image;
            product.brand = brand;
            product.category = category;
            product.countInStock = countInStock;

            const updatedProduct = await product.save();
            response.status(200).json(updatedProduct);
        } else {
            response.status(404);
            throw new Error("Resource not found");
        }
    })
);

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
productsRouter.delete(
    "/:id",
    verifyUserLoggedIn,
    verifyAdminAccess,
    asyncHandler(async (request, response) => {
        const product = await Product.findById(request.params.id);

        if (product) {
            await Product.deleteOne({ _id: product._id });
            response.status(200).json({ message: "Product deleted" });
        } else {
            response.status(404);
            throw new Error("Resource not found");
        }
    })
);

module.exports = productsRouter;
