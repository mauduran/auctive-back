const express = require('express');
const cors = require('cors');
const path = require('path');
const socketConfig = require('./src/utils/sockets.utils');
const scheduleUtils = require('./src/utils/auction-schedule.utils');

if (process.env.NODE_ENV == 'dev') {
    require('dotenv').config();
    console.log('dev');
}

const app = express();

const PORT = process.env.PORT || 3000;

console.log("TOKEN")
console.log(process.env.TOKEN_SECRET);
console.log("SECRET")

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => res.json(process.env));
app.use('/assets', express.static(path.join(__dirname, 'public')));

app.use('*', (req, res) => {
    res.status(404).json({ error: true, message: "Endpoint not found" });
});

const server = app.listen(PORT, () => {
    console.log("Server running on PORT " + PORT);
})

const socketUtils = socketConfig.socketInit(server);

scheduleUtils.getEventsForToday(socketUtils.notifyEndOfAuction);
scheduleUtils.setUpDailySchedule(socketUtils.notifyEndOfAuction);
