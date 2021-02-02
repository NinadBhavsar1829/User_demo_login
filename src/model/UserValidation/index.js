const Joi = require('joi');
const ErrorCustomizers = require('../../utils/ErrorCustomizer');
const userSchemas = require('./schema/user');

module.exports.validateWithoutFiles = (req, res, next) => {
  let pathParams, fileCheck, fileKeys = [], fileSizeRestriction;
  let custErr = {};
  custErr.data = [];
  let payload = req.body;
  switch (true) {
    case /registeruser/gi.test(req.originalUrl):
      pathParams = userSchemas.registerUserSchema();
      break;
    case /login/gi.test(req.originalUrl):
      pathParams = userSchemas.loginSchema();
      break;
    case /getuserlist/gi.test(req.originalUrl):
      pathParams = userSchemas.getUserListSchema();
      break;
    default:
      pathParams = userSchemas.defaultSchema();
      break;
  }

  Joi.validate(payload, pathParams, { abortEarly: false }, (err, res) => {
    if (err) {
      let customErrArray = ErrorCustomizers.JoiCustomErrors(err.details);
      custErr.statusCode = 400;
      custErr.data = custErr.data.concat(customErrArray);
    }
  });

  if (custErr.statusCode) {
    res.statusCode = 400;
    custErr.data = custErr.data.join(' ');
    next(custErr);
  } else {
    next();
  }
}













