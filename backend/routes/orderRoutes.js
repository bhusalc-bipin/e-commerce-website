const ordersRouter = require("express").Router();

const Order = require("../models/orderModel");
const asyncHandler = require("../middleware/asyncHandler");
const {
    verifyUserLoggedIn,
    verifyAdminAccess,
} = require("../middleware/authMiddleware");

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
ordersRouter.post(
    "/",
    verifyUserLoggedIn,
    asyncHandler(async (request, response) => {
        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        } = request.body;

        if (orderItems && orderItems.length === 0) {
            response.status(400);
            throw new Error("no order items");
        }

        const order = new Order({
            orderItems: orderItems.map((orderItem) => ({
                ...orderItem,
                product: orderItem._id,
                _id: undefined,
            })),
            buyer: request.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        });

        const savedOrder = await order.save();

        response.status(201).json(savedOrder);
    })
);

// @desc    Get logged in user's order
// @route   GET /api/orders/myorders
// @access  Private
ordersRouter.get(
    "/myorders",
    verifyUserLoggedIn,
    asyncHandler(async (request, response) => {
        const orders = await Order.find({ buyer: request.user._id });
        response.status(200).json(orders);
    })
);

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
ordersRouter.get(
    "/:id",
    verifyUserLoggedIn,
    asyncHandler(async (request, response) => {
        const order = await Order.findById(request.params.id).populate(
            "buyer",
            "name email"
        );

        if (order) {
            response.status(200).json(order);
        } else {
            response.status(404);
            throw new Error("order not found");
        }
    })
);

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
ordersRouter.put(
    "/:id/pay",
    verifyUserLoggedIn,
    asyncHandler(async (request, response) => {
        const order = await Order.findById(request.params.id);

        if (order) {
            order.isPaid = true;
            order.paidAt = Date.now();
            order.paymentResult = {
                id: request.body.id,
                status: request.body.status,
                update_time: request.body.update_time,
                email_address: request.body.payer.email_address,
            };

            const updatedOrder = await order.save();
            response.status(200).json(updatedOrder);
        } else {
            response.status(404);
            throw new Error("order not found");
        }
    })
);

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
ordersRouter.put(
    "/:id/deliver",
    verifyUserLoggedIn,
    verifyAdminAccess,
    asyncHandler(async (request, response) => {
        response.status(200).json("update order to delivered");
    })
);

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
ordersRouter.get(
    "/",
    verifyUserLoggedIn,
    verifyAdminAccess,
    asyncHandler(async (request, response) => {
        response.status(200).json("get all orders");
    })
);

module.exports = ordersRouter;
