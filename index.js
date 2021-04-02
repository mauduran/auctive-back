const express = require('express');
const cors = require('cors');
const path = require('path');

if(process.env.NODE_ENV=='dev'){
    require('dotenv').config();
}

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/assets', express.static(path.join(__dirname, 'public')));


// const socketUtils = require('./src/utils/socket-dictionary.utils');
// const socketConfig = require('./src/utils/socket.utils');

const app = express();

const server = app.listen(PORT, () => {
    console.log("Server running on PORT " + PORT);
})

socketConfig.socketInit(server);