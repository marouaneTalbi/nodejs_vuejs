const HttpError = require("./HttpError");

module.exports = class UnauthorizedError extends HttpError {
    constructor() {
        super(401, "Unauthorized");
    }
};