const uploadRouter = require("express").Router();
const path = require("path");
const multer = require("multer");

const {
    verifyUserLoggedIn,
    verifyAdminAccess,
} = require("../middleware/authMiddleware");

const storage = multer.diskStorage({
    destination(request, file, callback) {
        callback(null, "uploads/");
    },
    filename(request, file, callback) {
        callback(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        );
    },
});

const fileFilter = (request, file, callback) => {
    const filetypes = /jpg|jpeg|png/;
    const extname = filetypes.test(
        path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
        return callback(null, true);
    }
    callback(new Error("Only jpg, jpeg and png file format are accepted."));
};

const upload = multer({
    storage,
    fileFilter,
});

uploadRouter.post(
    "/",
    verifyUserLoggedIn,
    verifyAdminAccess,
    upload.single("image"),
    (request, response) => {
        response.status(200).send({
            message: "Image uploaded",
            image: `/${request.file.path}`,
        });
    }
);

module.exports = uploadRouter;
