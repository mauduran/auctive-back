const jwt = require("jsonwebtoken");

let authMiddleware = function (req, res, next) {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ error: true, message: "Missing authorization header" })

    try {
        //TODO: Find token in db
        const verification = jwt.verify(tokenObj.token, process.env.TOKEN_SECRET)
        if (verification) {
            // TODO:  user = findUserById

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