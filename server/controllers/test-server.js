exports.verifParam = function(req, res, next) {
    console.log('Sent name parameter: ' + req.params.name);
    next();
}

exports.displayMessage = function (req, res, next) {
    res.send('Hello ' + req.params.name);
    next();
}