
const userUtils = require('../utils/user.utils');

let userInfoMiddleware = async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ error: true, message: "Missing authorization header" })

    try {
        req._user = await userUtils.findUserByEmail(req._email);
        next();
    } catch (error) {
        res.status(401).json({
            error: true,
            message: error
        });
    }
}
module.exports = userInfoMiddleware