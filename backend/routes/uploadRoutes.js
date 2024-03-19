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
    const filetypes = /jpe?g|png/;
    const mimetypes = /image\/jpe?g|image\/png/;

    const extname = filetypes.test(
        path.extname(file.originalname).toLowerCase()
    );
    const mimetype = mimetypes.test(file.mimetype);

    if (extname && mimetype) {
        callback(null, true);
    } else {
        callback(new Error("jpg, jpeg and png format only!"), false);
    }
};

const upload = multer({ storage, fileFilter });
const uploadSingleImage = upload.single("image");

uploadRouter.post(
    "/",
    verifyUserLoggedIn,
    verifyAdminAccess,
    (request, response) => {
        uploadSingleImage(request, response, function (error) {
            if (error) {
                return response.status(400).json({ error: error.message });
            }

            response.status(200).json({
                message: "Image uploaded successfully",
                image: `/${request.file.path}`,
            });
        });
    }
);

module.exports = uploadRouter;
