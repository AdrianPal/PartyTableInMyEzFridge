const express = require('express'),
  passport = require('passport'),
  GameController = require('./controllers/game'),
  UserController = require('./controllers/user');

module.exports = function (app) {
  // Initializing route groups
  const apiRoutes = express.Router(),
    gameRoutes = express.Router(),
    gameUserRoutes = express.Router(),
    testServerRoutes = express.Router();


  //= ========================
  // Game Routes
  //= ========================
  apiRoutes.use('/game', gameRoutes);

  // Create a new game
  gameRoutes.post('/', GameController.newGame);
  //= ========================

  //= ========================
  // Game Users Routes
  //= ========================
  gameRoutes.use('/user', gameUserRoutes);

  // Add user to a game
  gameUserRoutes.post('/', UserController.newUserForGame);
  //= ========================

  // Set url for API group routes
  app.use('/api', apiRoutes);
};