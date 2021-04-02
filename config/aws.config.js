const AWS = require('aws-sdk');

if (process.env.NODE_ENV == 'dev') {
    require('dotenv').config();
}
AWS.config.update({
    region: 'us-east-1',
})

const S3 = AWS.S3();
const DynamoDB = AWS.DynamoDB();
const APIGateway = AWS.APIGateway();

module.exports = {
    AWS,
    S3,
    DynamoDB,
    APIGateway
}