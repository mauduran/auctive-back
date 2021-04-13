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

const getProfileInfo = async (req, res) => { 
    
}

const getUsers = async (req, res) => {
    const query = req.query.query;
    if(!query) return res.status(400).json({
        error: true,
        message: "Missing required fields"
    });

    try {
        let users = await userUtils.findUsers(query);
        return res.json({success: true, message: "Here is    a user list", data : users});

    } catch (error) {
        console.error(error);
        return res.status(400).json({ error: true, message: "Could not get users!" });
 
    }
 }

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

const updateUserPhoneNumber = async (req, res) => { 
    const email = req._user.email;
    const {phoneNumber} = req.body;
    
    if (!email || !phoneNumber) return res.status(400).json({
        error: true,
        message: "Missing required fields"
    });

    let regex = /^(\+{0,})(\d{0,})([(]{1}\d{1,3}[)]{0,}){0,}(\s?\d+|\+\d{2,3}\s{1}\d+|\d+){1}[\s|-]?\d+([\s|-]?\d+){1,2}(\s){0,}$/gm;

    
    if(!regex.test(phoneNumber)) return res.status(400).json({error: true, message: "Invalid phone number"});

    try {
        let user_update = await userUtils.addPhoneNumber(email, phoneNumber);
        return res.json({success: true, message: "Phone number changed!", user : user_update});
    } catch (error) {
        console.error(error);
        return res.status(400).json({ error: true, message: "Could not change phone number" });
    }
}


module.exports = {
    logOut,
    deleteUser,
    googleLogin,
    changePassword,
    getProfileInfo,
    getUser,
    getUsers,
    updateUserProfilePic,
    getMyUser,
    updateUserPhoneNumber
}