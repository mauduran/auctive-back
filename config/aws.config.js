const aws = require('aws-sdk');

if (process.env.NODE_ENV == 'dev') {
    require('dotenv').config();
}
aws.config.update({
    region: 'us-east-1',
})

//TODO: This file will be removed after implementing all functionality on lambda functions
const dynamoDB = new aws.DynamoDB.DocumentClient();

module.exports = {
    aws,
    dynamoDB,
}