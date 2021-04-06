const express = require('express');
const cors = require('cors');
const path = require('path');

const socketConfig = require('./src/utils/sockets.utils');

const notificationsRoute = require('./src/routes/notifications.route');
const auctionsRoute = require('./src/routes/auctions.route');
const userRoute = require('./src/routes/user.route');
const categoriesRoute = require('./src/routes/categories.route');
const auctionUtils = require('./src/utils/auction.utils');

if (process.env.NODE_ENV == 'dev') {
    require('dotenv').config();
}

const app = express();

auctionUtils.findAuctionsByCategory("Musica", 'sellado').then(()=>{}).catch(console.log)

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => res.json("Welcome"));
app.use('/assets', express.static(path.join(__dirname, 'public')));

app.use('/api/auctions', auctionsRoute);
app.use('/api/user/notifications', notificationsRoute);
app.use('/api/users', userRoute);
app.use('/api/categories', categoriesRoute);

app.use('*', (req, res) => {
    res.status(404).json({ error: true, message: "Endpoint not found" });
});



const server = app.listen(PORT, () => {
    console.log("Server running on PORT " + PORT);
})

socketConfig.socketInit(server);