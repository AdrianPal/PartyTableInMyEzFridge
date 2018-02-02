// Importing Node modules and initializing Express
const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  logger = require('morgan'),
  router = require('./router'),
  mongoose = require('mongoose'),
  socketEvents = require('./socketEvents'),
  config = require('./config/main'),
  SOCKET_SAVE = require('./utils/constants').SOCKET_SAVE,
  fileUpload = require('express-fileupload');

// Database Setup
mongoose.connect(config.database);

// Start the server
let server;
if (process.env.NODE_ENV != config.test_env) {
  server = app.listen(config.port, '192.168.1.20');
  console.log(`Your server is running on port ${config.port}.`);
} else {
  server = app.listen(config.test_port);
}

const io = require('socket.io').listen(server);
app.set(SOCKET_SAVE, io);

socketEvents(io);

// Setting up basic middleware for all Express requests
app.use(bodyParser.urlencoded({ extended: false })); // Parses urlencoded bodies
app.use(bodyParser.json()); // Send JSON responses
app.use(logger('dev')); // Log requests to API using morgan

// Enable CORS from client-side
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

app.use(config.assetStaticPath, express.static('assets'));

// default options
app.use(fileUpload());

// Import routes to be served
router(app, io);

// necessary for testing
module.exports = server;