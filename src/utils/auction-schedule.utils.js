const schedule = require('node-schedule');
const axios = require('axios');
const dateUtils = require('./date.utils');
const { dynamoDB } = require("../../config/aws.config")
const { notifyEndOfAuction } = require("./sockets.utils");

if (process.env.NODE_ENV == 'dev') {
    require('dotenv').config();
}


const getEventsForToday = () => {
    let date = dateUtils.getTodayString();

    headers = { 'Content-Type': 'application/json', 'X-API-KEY': process.env.SERVERLESS_API_KEY }

    const configParams = {
        headers
    }
    return axios.get(`${process.env.API_GATEWAY_URL}/scheduled-actions`, configParams)
        .then(res => {
            const data = res.data;
            data.items.forEach(item => {
                scheduleAuctionClose(item);
            });
            return data.items;
        })
        .catch(err => {
            console.error(err);
        })
}



const cancelScheduledEvent = (auctionId) => {
    schedule.scheduledJobs[auctionId].cancel();
}


const setUpDailySchedule = () => {
    const rule = new schedule.RecurrenceRule();
    rule.hour = 0;
    rule.tz = 'America/New_York';

    schedule.scheduleJob("daily-schedule", rule, getEventsForToday);
}

const scheduleAuctionClose = (auction) => {
    let date = new Date(auction.date);

    if (auction.pending) {
        if (date < new Date()) {
            // TODO: AuctionUtils.AuctionClose
            notifyEndOfAuction(auction);
        }
        schedule.scheduleJob(auction.auction_id, date, () => {
            // TODO: AuctionUtils.AuctionClose (socketUtil)
            notifyEndOfAuction(auction);
        })
    }

}

module.exports = {
    getEventsForToday,
    setUpDailySchedule,
    cancelScheduledEvent,
    scheduleAuctionClose
}