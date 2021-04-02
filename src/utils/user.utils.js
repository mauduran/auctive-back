const signToken = (email) => {
    return jwt.sign({
        email
    }, process.env.TOKEN_SECRET);
}
const findToken = async (token) => { }

const findUsers = async (query) => { }

const findUserByEmail = async (email) => { }

const findUserById = async (userId) => { }

const deleteUser = async (userId) => { }

const changePassword = async (userId, currentPassword, newPassword) => { }

const updateUserWithGoogleId = async (userId, googleId) => { }

const updateUserProfilePic = async (userId, imageUrl) => { }

module.exports = {
    findToken,
    findUsers,
    findUserByEmail,
    findUserById,
    deleteUser,
    changePassword,
    updateUserWithGoogleId,
    updateUserProfilePic
}