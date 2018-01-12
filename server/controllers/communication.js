/**
 * Communication Controller.
 */

exports.sendContactForm = function (req, res, next) {
  // const fromText = `${req.body.firstName} ${req.body.lastName} ` +
  //                 `<${req.body.email}>`;

  return res.status(200).json({ message: 'Message received.' });
};

exports.getInfoFromServer = function (req, res, next) {
  let msg = "Your param is: "+req.query.id;

  return res.status(200).json({ message: msg });
};
