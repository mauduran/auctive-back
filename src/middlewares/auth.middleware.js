
const tokenUtils = require('../utils/token.utils');
const userUtils = require('../utils/user.utils');

let authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ error: true, message: "Missing authorization header" })

    try {

        tokenObj = await tokenUtils.findToken(token);

        const verification = tokenUtils.verifyToken(token);
        if (verification) {
            user = userUtils.findUserById(userId);

            delete user.hash
            req._user = user
            next()
        }

    } catch (error) {
        res.status(401).json({
            error: true,
            message: "Invalid Token!"
        })
    }
}
module.exports = authMiddleware