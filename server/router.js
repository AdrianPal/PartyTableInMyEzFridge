const CommunicationController = require('./controllers/communication');

const express = require('express');

module.exports = function (app) {
  // Initializing route groups
  const apiRoutes = express.Router(),
    communicationRoutes = express.Router();

  //= ========================
  // User Routes
  //= ========================

  //= ========================
  // Communication Routes
  //= ========================
  apiRoutes.use('/communication', communicationRoutes);

  // Send email from contact form
  communicationRoutes.post('/contact', CommunicationController.sendContactForm);

  // Get Serveri infos
  communicationRoutes.get('/contact', CommunicationController.getInfoFromServer);

  // Set url for API group routes
  app.use('/api', apiRoutes);
};
