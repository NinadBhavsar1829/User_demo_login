const router = require('../src/routers');

const errorHandler = require('../src/modules/errorHandler/errorHandler');
const responseHandler = require('../src/modules/responseHandler')

exports.expressify = (app, callback) => {
  try {
    app.use(router);
    app.use(responseHandler)
    app.use(errorHandler);
    callback(null);
  } catch (e) { callback(e) }
}