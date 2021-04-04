const jwt = require("jsonwebtoken");

const { dynamoDB } = require("../../config/aws.config")

const signToken = (email) => {
    const token = jwt.sign({
        email
    }, process.env.TOKEN_SECRET);

    params = {
        TableName: process.env.AWS_DYNAMODB_TABLE,
        Key: {
            "PK": `USER#${email}`,
            "SK": `#PROFILE#${email}`
        },
        UpdateExpression: "set session_token = :session_token",
        ExpressionAttributeValues: {
            ":session_token": token,
        },
        ReturnValues: "UPDATED_NEW"
    }

    return dynamoDB.update(params).promise()
        .then(user => {
            return token;
        })
        .catch(err => {
            return err;
        });
}

const removeToken = (email) => {
    params = {
        TableName: process.env.AWS_DYNAMODB_TABLE,
        Key: {
            "PK": `USER#${email}`,
            "SK": `#PROFILE#${email}`
        },
        UpdateExpression: "remove session_token",
        ReturnValues: "UPDATED_NEW"
    }

    return dynamoDB.update(params).promise()
        .then(user => {
            return true;
        })
        .catch(err => {
            return err;
        });
}

const saveToken = async (userId, token) => { }

const getUserFromToken = async (token) => {
    params = {
        TableName: process.env.AWS_DYNAMODB_TABLE,
        IndexName: process.env.AWS_DYNAMODB_SESSION_INDEX,
        KeyConditionExpression: "session_token = :token",
        ExpressionAttributeValues: {
            ":token": token,
        },
    }
    try {
        let data = await dynamoDB.query(params).promise();

        if (!data.Items || !data.Items.length) {
            throw "Could not find token";
        }
        user = data.Items[0];

        const verification = jwt.verify(user.session_token, process.env.TOKEN_SECRET);
        if (verification) {
            return Promise.resolve(user);
        }
        throw "Token is not valid";

    } catch (error) {
        return Promise.reject(error);
    }

}


const findToken = async (token) => { }


module.exports = {
    signToken,
    saveToken,
    removeToken,
    findToken,
    removeToken,
    getUserFromToken
}