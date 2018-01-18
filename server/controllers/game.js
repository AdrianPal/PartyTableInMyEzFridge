const Game = require('../models/game'),
    User = require('../models/user'),
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

exports.refreshGame = function (req, res, next) {
    User.find({
            gameId: req.body.gameId
        })
        .select('name pos')
        .exec((err, users) => {
            if (err) {
                return next(err);
            }

            let io = socketHelper.getSocket(req);
            io.sockets.in(req.body.gameId).emit('refresh game', { game: users });
        });
};