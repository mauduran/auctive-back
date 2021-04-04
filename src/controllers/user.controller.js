const { OAuth2Client } = require('google-auth-library');
const userUtils = require('../utils/user.utils');


if (process.env.NODE_ENV == 'dev') {
    require('dotenv').config();
}


// const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            error: true,
            message: "Missing required fields"
        });
    }

    try {
        const user = await userUtils.createUser(name, email.toLowerCase(), password);
        return res.status(201).json({ success: true, user: user });

    } catch (error) {
        let message = "Could not process request.";
        let status = 400;
        if (error.code && error.code == "ConditionalCheckFailedException") {
            status = 409;
            message = "User already exists";
        }
        return res.status(status).json({ error: true, message: message });
    }

}

const login = (req, res) => { }

const logOut = async (req, res) => { }

const deleteUser = async (req, res) => { }

const googleLogin = async (req, res) => { }

const changePassword = function (req, res) { }

const getProfileInfo = async (req, res) => { }

const getUsers = async (req, res) => { }

const getUser = async (req, res) => { }

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
    updateUserProfilePic
}