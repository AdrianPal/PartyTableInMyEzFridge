const Game = require('../models/game'),
    GameController = require('./game'),
    socketHelper = require('../utils/socketHelper'),
    User = require('../models/user'),
    colors = require('../config/colors'),
    config = require('../config/main'),
    fileUpload = require('express-fileupload'),
    uuidV4 = require('uuid/v4');

getRandomColorFromCurrentUsedColors = function (userColors) {
    let color;

    do {
        color = colors[Math.floor(Math.random() * colors.length)];
    } while (userColors.some(c => (c.color === color)));

    return color;
}

exports.newUserForGame = function (req, res, next) {
    let gameId = req.body.gameId;

    // If given game id is incorrect
    if (!gameId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({
            message: 'The requested GameId is incorrect.'
        });
    }

    let path = null,
        avatar = null;

    if (!req.files || !Object.keys(req.files).length)
        path = './assets/' + req.params.pos + '-default.png';
    else {
        // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
        avatar = req.files.avatar;
        let extension = avatar.mimetype.replace(/image\//, '');

        console.log(avatar);

        // Generate a unique name
        path = './assets/' + uuidV4() + '.' + extension;
    }

    if (avatar) {
        // Use the mv() method to place the file somewhere on your server
        avatar.mv(path, function (err) {
            if (err) {
                console.log(err);
                return res.status(500).send(err);
            }
        });
    }

    // Find all users colors
    User.find({
            gameId: gameId
        }, {
            _id: 0
        })
        .select('color')
        .exec((err, usersColors) => {
            let uColors;

            if (err)
                uColors = [];
            else
                uColors = usersColors;

            let colorForUser = getRandomColorFromCurrentUsedColors(uColors);

            // Create the user
            const user = new User({
                conversationId: req.params.conversationId,
                name: req.body.name,
                pos: req.params.pos,
                color: getRandomColorFromCurrentUsedColors(uColors),
                gameId: gameId,
                avatarPath: path.replace('/assets', config.assetStaticPath),
            });

            // Save it
            user.save((err, newUser) => {
                if (err) {
                    res.send({
                        error: err
                    });
                    return next(err);
                }

                // Join the current party
                let io = socketHelper.getSocket(req);

                io.sockets.in(gameId).emit('mobile test', null);

                // Update the game table
                GameController.refreshGame(req, res, next);

                // Return the new user
                return res.status(200).json(newUser);
            });
        });
};

/**
 * Get all users for a game id
 */
exports.allUsersForGame = function (req, res, next) {
    let gameId = req.params.gameId;

    // If given game id is incorrect
    if (!gameId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({
            message: 'The requested GameId is incorrect.'
        });
    }

    // Find all users
    User.find({
            gameId: gameId
        })
        .select('name pos avatarPath color')
        .exec((err, users) => {
            if (err) {
                return next(err);
            }

            return res.status(200).json(users);
        });
};

/**
 * Get a user for a game id and a position
 */
exports.userForGameAndPosition = function (req, res, next) {
    let gameId = req.params.gameId;

    if (!gameId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({
            message: 'The requested GameId is incorrect.'
        });
    }

    User.findOne({
            gameId: gameId,
            pos: req.params.pos
        })
        .select('name pos avatarPath color')
        .exec((err, user) => {
            if (err) {
                return next(err);
            }

            if (user === null) {
                return res.status(404).json({
                    message: 'User not found.'
                });
            } else {
                return res.status(200).json(user);
            }
        });
};