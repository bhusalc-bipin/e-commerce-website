const jwt = require("jsonwebtoken");
const asyncHandler = require("./asyncHandler");
const User = require("../models/userModel");
const config = require("../utils/config");

const verifyUserLoggedIn = asyncHandler(async (request, response, next) => {
    const jwtToken = request.cookies.jwt;

    if (jwtToken) {
        try {
            const decodedToken = jwt.verify(jwtToken, config.JWT_SECRET);
            request.user = await User.findById(decodedToken.id);
            next();
        } catch (error) {
            response.status(401);
            throw new Error("not authorized, token failed");
        }
    } else {
        response.status(401);
        throw new Error("not authorized, no token");
    }
});

const verifyAdminAccess = (request, response, next) => {
    if (request.user && request.user.isAdmin) {
        next();
    } else {
        response.status(401);
        throw new Error("admin access needed");
    }
};

module.exports = { verifyUserLoggedIn, verifyAdminAccess };
