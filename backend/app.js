const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");

const logger = require("./utils/logger");
const connectDB = require("./utils/db");
const {
    errorHandler,
    unknownEndpoint,
} = require("./middleware/errorMiddleware");
const productsRouter = require("./routes/productRoutes");
const usersRouter = require("./routes/userRoutes");
const ordersRouter = require("./routes/orderRoutes");
const uploadRouter = require("./routes/uploadRoutes");
const config = require("./utils/config");

const app = express();

logger.info("connecting to MongoDB");
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/products", productsRouter);
app.use("/api/users", usersRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/upload", uploadRouter);

app.get("/api/config/paypal", (request, response) =>
    response.send({ paypalClientID: config.PAYPAL_CLIENT_ID })
);

const currDir = path.resolve();
app.use("/uploads", express.static(path.join(currDir, "/uploads")));

if (config.NODE_ENV === "production") {
    app.use(express.static(path.join(currDir, "/frontend/dist")));
    // any route that is not api will be redirected to index.html
    app.get("*", (request, response) =>
        response.sendFile(
            path.resolve(currDir, "frontend", "dist", "index.html")
        )
    );
}

app.use(errorHandler);
app.use(unknownEndpoint);

module.exports = app;
