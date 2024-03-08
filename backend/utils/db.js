const mongoose = require("mongoose");

const config = require("./config");
const logger = require("./logger");

const connectDB = async () => {
    mongoose.set("strictQuery", false);

    try {
        await mongoose.connect(config.MONGODB_URI);
        logger.info("connected to MongoDB");
    } catch (error) {
        logger.error("error connecting to MongoDB:", error);
    }
};

module.exports = connectDB;
