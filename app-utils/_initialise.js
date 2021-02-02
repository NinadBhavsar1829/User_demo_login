const configFile = require('../config/config');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');


exports.initialize = (app, callback) => {

  configFile.createConfig((err) => {
    if (err) { callback(err); }
    else {
      config = Object.assign({}, global.gConfig)
      require('../src/connections/mongodb').connectToServer((err) => {
        if (err) {
          console.error(err);
          process.exit(1);
        } else {
          callback(null);
        }
      });

      app.use(bodyParser.json({ limit: '50mb' }));
      app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
      app.use(require('../src/modules/requestLogger/' + global.gConfig.appMgmt.requestLogger));

      app.use(cookieParser(''));

      app.use(cors({ origin: true, credentials: true }));
      app.use((req, res, next) => {
        req.response = {}
        next()
      })
      app.use(function (req, res, next) {
        res.header('Access-Control-Allow-Credentials', true);
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        if (req.method === "OPTIONS") {
          return res.status(200).end();
        } else {
          next();
        }
      });
      app.use(require('../src/swagger'));
    }
  })
}