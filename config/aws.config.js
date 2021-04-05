const aws = require('aws-sdk');

if (process.env.NODE_ENV == 'dev') {
    require('dotenv').config();
}
aws.config.update({
    region: 'us-east-1',
})

const s3 = new aws.S3();
const dynamoDB = new aws.DynamoDB.DocumentClient();
const apiGateway = new aws.APIGateway();
const cloudSearch = new aws.CloudSearchDomain({ endpoint: process.env.CLOUD_SEARCH_ENDPOINT });

module.exports = {
    aws,
    s3,
    dynamoDB,
    apiGateway,
    cloudSearch
}