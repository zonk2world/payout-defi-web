// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign
const app = require('./config/express');
const server = require('http').createServer(app);
require("dotenv").config();

const startDaemon = require('./daemons');

//Create server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}...`));

// start daemon
startDaemon();