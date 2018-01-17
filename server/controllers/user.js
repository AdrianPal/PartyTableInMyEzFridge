const Game = require('../models/game'),
    GameController = require('./game'),
    User = require('../models/user');

exports.newUserForGame = function (req, res, next) {
    const user = new User({
        conversationId: req.params.conversationId,
        name: req.body.name,
        pos: req.body.pos,
        gameId: req.body.gameId
    });

    user.save((err, newUser) => {
        if (err) {
            res.send({
                error: err
            });
            return next(err);
        }

        GameController.refreshGame(req, res, next);

        return res.status(200).json({ message: 'User added successfully!' });
    });
};