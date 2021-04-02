const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require('google-auth-library');


if (process.env.NODE_ENV == 'dev') {
    require('dotenv').config();
}


// const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

const createUser = (req, res) => { }

const login = (req, res) => { }

const logOut = async (req, res) => { }

const deleteUser = async (req, res) => { }

const googleLogin = async (req, res) => { }

const changePassword = function (req, res) { }

const getProfileInfo = async (req, res) => { }

const getUsers = async (req, res) => { }

const getUser = async (req, res) => { }

const updateUserProfilePic = async (req, res) => { }




const signToken = (email) => {
    return jwt.sign({
        email
    }, process.env.TOKEN_SECRET);
}

module.exports = {
    createUser,
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