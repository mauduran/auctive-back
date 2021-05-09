const schedule = require('node-schedule');
const axios = require('axios');
const dateUtils = require('./date.utils');

if (process.env.NODE_ENV == 'dev') {
    require('dotenv').config();
}


const getEventsForToday = async (cb) => {
    let date = dateUtils.getTodayString();

    headers = { 'Content-Type': 'application/json', 'X-API-KEY': process.env.SERVERLESS_API_KEY }

    const configParams = {
        headers
    }

    return axios.get(`${process.env.API_GATEWAY_URL}/scheduled-actions`, configParams)
        .then(res => {
            const data = res.data;

            data.items.forEach(item => {
                cb(item.auction_id, item.owner_email, item.date);
            });
            return data.items;
        })
        .catch(err => {
            console.error(err);
        })
}


const setUpDailySchedule = (cb) => {
    const rule = new schedule.RecurrenceRule();
    rule.hour = 0;
    rule.tz = 'America/New_York';

    schedule.scheduleJob("daily-schedule", rule, () => getEventsForToday(cb));
}




module.exports = {
    getEventsForToday,
    setUpDailySchedule,
}