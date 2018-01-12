const express = require('express');
const passport = require('passport');
const TestServerController = require('./controllers/test-server');

module.exports = function (app) {
  // Initializing route groups
  const apiRoutes = express.Router(),
    testServerRoutes = express.Router()


  apiRoutes.use('/test', testServerRoutes);

  testServerRoutes.get('/:name', TestServerController.verifParam, TestServerController.displayMessage);

  // Set url for API group routes
  app.use('/api', apiRoutes);
};
