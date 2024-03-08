const { isValidObjectId } = require("mongoose");

const errorHandler = (error, request, response, next) => {
    if (request.params.id && !isValidObjectId(request.params.id)) {
        return response.status(404).json({ error: "invalid ObjectId" });
    }

    const statusCode = response.statusCode === 200 ? 500 : response.statusCode;
    response.status(statusCode).json({ error: error.message });
};

const unknownEndpoint = (request, response) => {
    response.status(404).json({ error: "unknown endpoint" });
};

module.exports = {
    errorHandler,
    unknownEndpoint,
};
