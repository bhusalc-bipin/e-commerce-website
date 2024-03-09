const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const usersRouter = require("express").Router();

const User = require("../models/userModel");
const asyncHandler = require("../middleware/asyncHandler");
const {
    verifyUserLoggedIn,
    verifyAdminAccess,
} = require("../middleware/authMiddleware");
const generateToken = require("../utils/generateToken");

// @desc    Login user
// @route   POST /api/users/
// @access  Public
usersRouter.post(
    "/",
    asyncHandler(async (request, response) => {
        const { email, password } = request.body;

        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
            response.status(401);
            throw new Error("invalid credentials");
        }

        generateToken(response, user._id);

        response.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        });
    })
);

// @desc    Signup a new user
// @route   POST /api/users/signup
// @access  Public
usersRouter.post(
    "/signup",
    asyncHandler(async (request, response) => {
        const { name, email, password } = request.body;

        if (await User.findOne({ email })) {
            response.status(400);
            throw new Error("user already exists");
        }

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const user = new User({
            name,
            email,
            passwordHash,
        });

        const savedUser = await user.save();

        if (savedUser) {
            generateToken(response, savedUser._id);
            response.status(201).json({
                _id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email,
                isAdmin: savedUser.isAdmin,
            });
        } else {
            response.status(400);
            throw new Error("invalid user data");
        }
    })
);

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
usersRouter.post(
    "/logout",
    asyncHandler(async (request, response) => {
        response.cookie("jwt", "", {
            httpOnly: true,
            expires: new Date(0),
        });
        response.status(200).json({ message: "logged out successfully" });
    })
);

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
usersRouter.get(
    "/profile",
    verifyUserLoggedIn,
    asyncHandler(async (request, response) => {
        const user = await User.findById(request.user._id);
        if (user) {
            response.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
            });
        } else {
            response.status(400);
            throw new Error("user not found");
        }
    })
);

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
usersRouter.put(
    "/profile",
    verifyUserLoggedIn,
    asyncHandler(async (request, response) => {
        const user = await User.findById(request.user._id);

        if (user) {
            user.name = request.body.name || user.name;
            user.email = request.body.email || user.email;

            if (request.body.password) {
                const saltRounds = 10;
                user.passwordHash = await bcrypt.hash(
                    request.body.password,
                    saltRounds
                );
            }

            const updatedUser = await user.save();
            response.status(200).json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
            });
        } else {
            response.status(400);
            throw new Error("user not found");
        }
    })
);

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
usersRouter.get(
    "/",
    verifyUserLoggedIn,
    verifyAdminAccess,
    asyncHandler(async (request, response) => {
        response.status(200).send("get all users (admin)");
    })
);

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
usersRouter.delete(
    "/:id",
    verifyUserLoggedIn,
    verifyAdminAccess,
    asyncHandler(async (request, response) => {
        response.status(200).send("delete a user (admin)");
    })
);

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
usersRouter.get(
    "/:id",
    verifyUserLoggedIn,
    verifyAdminAccess,
    asyncHandler(async (request, response) => {
        response.status(200).send("get a user by id (admin)");
    })
);

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
usersRouter.put(
    "/:id",
    verifyUserLoggedIn,
    verifyAdminAccess,
    asyncHandler(async (request, response) => {
        response.status(200).send("update a user (admin)");
    })
);

module.exports = usersRouter;
