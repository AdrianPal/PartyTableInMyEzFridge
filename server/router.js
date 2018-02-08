const express = require('express'),
  passport = require('passport'),
  GameController = require('./controllers/game'),
  UserController = require('./controllers/user');

module.exports = function (app, io) {
  // Initializing route groups
  const apiRoutes = express.Router(),
    userRoutes = express.Router(),
    gameRoutes = express.Router(),
    gameUserRoutes = express.Router(),
    testServerRoutes = express.Router();

  //= ========================
  // Game Routes
  //= ========================
  apiRoutes.use('/game', gameRoutes);

  // Create a new game
  gameRoutes.post('/', GameController.newGame);

  gameRoutes.get('/new/:gameId', GameController.newGameWithPlayersFromPrevious);
  
  //= ========================
  // Game Users Routes
  //= ========================
  gameRoutes.use('/user', gameUserRoutes);

  // Add user to a game
  gameUserRoutes.post('/:pos', UserController.newUserForGame);

  //= ========================
  // Users Routes
  //= ========================
  apiRoutes.use('/user', userRoutes);

  // Update user position & lap
  userRoutes.put('/', UserController.updatePositionAndLapForUser);

  // Update user position & lap
  userRoutes.put('/points', UserController.addPointsToUser);
  
  // Get all users for a game
  userRoutes.get('/:gameId', UserController.allUsersForGame);
  
  // Get all users for a game
  userRoutes.get('/:gameId/:pos', UserController.userForGameAndPosition);
  //= ========================

  // Set url for API group routes
  app.use('/api', apiRoutes);
};