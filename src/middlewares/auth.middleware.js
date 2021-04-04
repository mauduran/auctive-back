
const tokenUtils = require('../utils/token.utils');
const userUtils = require('../utils/user.utils');

let authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ error: true, message: "Missing authorization header" })

    try {
        user = await tokenUtils.getUserFromToken(token);
        req._user = user;
        next();
    } catch (error) {
        res.status(401).json({
            error: true,
            message: error
        });
    }
}
module.exports = authMiddleware