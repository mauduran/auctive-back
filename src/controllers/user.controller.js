const { OAuth2Client } = require('google-auth-library');
const userUtils = require('../utils/user.utils');
const tokenUtils = require('../utils/token.utils');

//  TODO: Have function to return missing fields response

if (process.env.NODE_ENV == 'dev') {
    require('dotenv').config();
}

// const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)


const logOut = async (req, res) => {
    const { email } = req._user;
    try {
        await tokenUtils.removeToken(email);
        return res.json({ success: true, message: "Logged out" });
    } catch (error) {
        return res.status(400).json({ error: true, message: "Could not log out" });
    }

}

const deleteUser = async (req, res) => { }

const googleLogin = async (req, res) => { }

const changePassword = async function (req, res) {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) return res.status(400).json({
        error: true,
        message: "Missing required fields"
    });

    try {
        await userUtils.verifyCredentials(req._user.p_hash, currentPassword);
        await userUtils.changePassword(req._user.email, newPassword);
        res.json({success: true, message: "Password changed!"});
    } catch (error) {
        return res.status(400).json({ error: true, message: "Could not change password" });
    }

}

const getProfileInfo = async (req, res) => { }

const getUsers = async (req, res) => { }

const getUser = async (req, res) => {
    const { email } = req.params;

    if (!email) return res.status(400).json({
        error: true,
        message: "Missing required fields"
    });

    try {
        user = await userUtils.findUserByEmail(email);
        delete user.p_hash;
        delete user.session_token;
        return res.json({ success: true, user: user });
    } catch (error) {
        return res.status(status).json({ error: true, message: "Could not process request" });
    }
}

const getMyUser = (req, res) => {
    return res.json(req._user);
}

const updateUserProfilePic = async (req, res) => { }


module.exports = {
    registerUser,
    login,
    logOut,
    deleteUser,
    googleLogin,
    changePassword,
    getProfileInfo,
    getUser,
    getUsers,
    updateUserProfilePic,
    getMyUser
}