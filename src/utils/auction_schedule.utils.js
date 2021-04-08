
const dateUtils = require('../utils/date.utils');
const { dynamoDB } = require("../../config/aws.config")
const schedule = require('node-schedule');

if (process.env.NODE_ENV == 'dev') {
    require('dotenv').config();
}

const getEventsForToday = () => {
    let date = dateUtils.getTodayString();

    params = {
        TableName: process.env.AWS_DYNAMODB_TABLE,
        KeyConditionExpression: "PK = :pk  and begins_with (SK, :sk)",
        ExpressionAttributeValues: {
            ":pk": "SCHEDULED_ACTION#",
            ":sk": `#DATE#${date}`
        },
    }
    return dynamoDB.query(params).promise()
        .then(data => {

            data.Items.forEach(item => {
                scheduleAuctionClose(item);
            });

            return data.Items;
        });
}

const cancelScheduledEvent = (auctionId) => {
    schedule.scheduledJobs[auctionId].cancel();
}


const setUpDailySchedule = () => {
    const rule = new schedule.RecurrenceRule();
    rule.hour = 0;
    rule.tz = 'America/Mexico_City';

    schedule.scheduleJob("daily-schedule", rule, getEventsForToday);
}

const scheduleAuctionClose = (auction) => {
    let date = new Date(auction.date);

    if (auction.pending){
        if (date < new Date()) {
            // TODO: AuctionUtils.AuctionClose
        }
        schedule.scheduleJob(auction.auction_id, date, () => {
            // TODO: AuctionUtils.AuctionClose (socketUtil)
        })
    }

}

module.exports = {
    getEventsForToday,
    setUpDailySchedule,
    cancelScheduledEvent,
    scheduleAuctionClose
}