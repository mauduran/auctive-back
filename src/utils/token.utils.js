const jwt = require("jsonwebtoken");

const signToken = (email) => {
    return jwt.sign({
        email
    }, process.env.TOKEN_SECRET);
}

const verifyToken = (token) => {
    return jwt.verify(token, process.env.TOKEN_SECRET)
}

const saveToken = async (userId, token) => { }

const removeToken = async (tokenId) => { }

const findToken = async (token) => { }


module.exports = {
    signToken,
    verifyToken,
    saveToken,
    findToken,
    removeToken,
}