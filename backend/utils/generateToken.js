const jwt = require("jsonwebtoken");
const config = require("./config");

const generateToken = (response, id) => {
    const tokenPayload = { id };

    const token = jwt.sign(tokenPayload, config.JWT_SECRET, {
        expiresIn: "1h",
    });

    response.cookie("jwt", token, {
        httpOnly: true,
        secure: config.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 60 * 60, // 1 hr
    });
};

module.exports = generateToken;
