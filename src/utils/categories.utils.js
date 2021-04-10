const { dynamoDB } = require("../../config/aws.config")

if (process.env.NODE_ENV == 'dev') {
    require('dotenv').config();
}

const getAllCategories = async () => {
    params = {
        TableName: process.env.AWS_DYNAMODB_TABLE,
        KeyConditionExpression: "PK = :pk  and begins_with (SK, :sk)",
        ExpressionAttributeValues: {
            ":pk": "CATEGORY",
            ":sk": '#CATEGORY#'
        },
    }

    return dynamoDB.query(params).promise()
        .then(data => {
            return data.Items.map(result => result.category_name);
        });
}

const deleteCategory = async (categoryId) => {
    params = {
        TableName: process.env.AWS_DYNAMODB_TABLE,
        Key: {
            PK: 'CATEGORY',
            SK: `#CATEGORY#${categoryId}`
        },
    }

    return dynamoDB.delete(params).promise()
        .then(data => {
            return data.Items;
        });
}


module.exports = {
    getAllCategories,
    deleteCategory
}