require("dotenv").config();

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const NODE_ENV = process.env.NODE_ENV;
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;

module.exports = {
    PORT,
    MONGODB_URI,
    JWT_SECRET,
    NODE_ENV,
    PAYPAL_CLIENT_ID,
};
