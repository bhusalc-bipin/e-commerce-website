const productsRouter = require("express").Router();

const Product = require("../models/productModel");
const asyncHandler = require("../middleware/asyncHandler");
const {
    verifyUserLoggedIn,
    verifyAdminAccess,
} = require("../middleware/authMiddleware");
const config = require("../utils/config");

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
productsRouter.get(
    "/",
    asyncHandler(async (request, response) => {
        const pageSize = config.PAGINATION_LIMIT;
        const page = Number(request.query.pageNumber) || 1;

        const keyword = request.query.keyword
            ? { name: { $regex: request.query.keyword, $options: "i" } }
            : {};

        const count = await Product.countDocuments({ ...keyword });

        const products = await Product.find({ ...keyword })
            .limit(pageSize)
            .skip(pageSize * (page - 1));
        response
            .status(200)
            .json({ products, page, pages: Math.ceil(count / pageSize) });
    })
);

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
productsRouter.get(
    "/top",
    asyncHandler(async (request, response) => {
        const products = await Product.find({}).sort({ rating: -1 }).limit(3);
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
        throw new Error("Product not found");
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
            throw new Error("Product not found");
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
            throw new Error("Product not found");
        }
    })
);

// @desc    Create a new review
// @route   POST /api/products/:id/reviews
// @access  Private
productsRouter.post(
    "/:id/reviews",
    verifyUserLoggedIn,
    asyncHandler(async (request, response) => {
        const { rating, comment } = request.body;

        const product = await Product.findById(request.params.id);

        if (product) {
            const alreadyReviewed = product.reviews.find(
                (review) =>
                    review.authorId.toString() === request.user._id.toString()
            );

            if (alreadyReviewed) {
                response.status(400);
                throw new Error("Product already reviewed");
            }

            const review = {
                authorId: request.user._id,
                authorName: request.user.name,
                rating: Number(rating),
                comment,
            };

            product.reviews.push(review);
            product.numReviews = product.reviews.length;
            product.rating =
                product.reviews.reduce(
                    (acc, review) => acc + review.rating,
                    0
                ) / product.reviews.length;

            await product.save();
            response.status(201).json({ message: "Review added" });
        } else {
            response.status(404);
            throw new Error("Product not found");
        }
    })
);

module.exports = productsRouter;
