const jwt = require("jsonwebtoken");
const UnauthorizedError = require("../errors/UnauthorizedError");

module.exports = (roles = []) => {
    return (req, res, next) => {
        if (!req.headers.authorization) {
            return next(new UnauthorizedError());
        }
        const [type, token] = req.headers.authorization.split(" ");
        if (type !== "Bearer") {
            return next(new UnauthorizedError());
        }
        try {
            const user = jwt.verify(token, 'secretKey');
            req.user = user;
            if (roles.length > 0 && !roles.includes(user.role)) {
                console.log('test')
                console.log(roles)
                return next(new UnauthorizedError());
            }
            next();
        } catch (err) {
            return next(new UnauthorizedError());
        }
    };
};
