const Game = require('../models/game'),
    User = require('../models/user'),
    ObjectID = require('mongodb').ObjectID,
    socketHelper = require('../utils/socketHelper');

exports.newGame = function (req, res, next) {
    const game = new Game();

    game.save((err, newGame) => {
        if (err) {
            res.send({
                error: err
            });
            return next(err);
        }

        return res.status(200).json({
            message: 'New game started!',
            gameId: newGame._id
        });
    });
};

exports.newGameWithPlayersFromPrevious = function (req, res, next) {
    const game = new Game();

    game.save((err, newGame) => {
        if (err) {
            res.send({
                error: err
            });
            return next(err);
        }

        User.find({
                gameId: req.params.gameId
            })
            .select('name pos avatarPath color position points lap gameId tangible')
            .exec((err, users) => {
                if (err) {
                    return next(err);
                }

                console.log(users);

                for (let i = 0; i < users.length; i++)  {
                    users[i].gameId = newGame._id;
                    users[i]._id = new ObjectID();

                    users[i].position = 0;
                    users[i].lap = 0;
                    users[i].points = 0;
                }

                User.collection.insert(users, function (err, newUsers) {
                    if (err) {
                        console.error(err);
                    } else {
                        console.log(newUsers);
                    }
                });

                return res.status(200).json({
                    gameId: newGame._id,
                    users: users
                });
            });
    });
};

exports.refreshGame = function (req, res, next) {
    User.find({
            gameId: req.body.gameId
        })
        .select('name pos avatarPath color position points lap tangible')
        .exec((err, users) => {
            if (err) {
                return next(err);
            }

            let io = socketHelper.getSocket(req);
            io.sockets.in(req.body.gameId).emit('refresh game', {
                game: users
            });
        });
};

exports.checkIfThisGameIsTheLastest = function (gameId) {
    Game.findOne()
        .sort([
            ['_id', -1]
        ])
        .exec((err, game) => {
            if (err || game._id === gameId) {
                return true;
            } else {
                return false;
            }
        });
}