const MongoClient = require('mongodb').MongoClient;
const _ = require('lodash');
const config = Object.assign({}, global.gConfig)
const _url = config.mongoDB.connectionString;
const options = {
  useNewUrlParser: true,
  connectTimeoutMS: 60000,
  useUnifiedTopology: true
}

var _db;

module.exports = {
  connectToServer: function (callback) {
    MongoClient.connect(_url, options, async function (err, db) {
      if (err) { callback(err); }
      else {
        try {
          console.log(`Connected to Mongo-${db.db().databaseName}`);
          global.gClientInstance = db;
          _db = db.db();
          await require('../utils/serverStartup').createIndexesOnStartup({ dbConn: _db });
          callback(null);
        } catch (error) {
          console.log(error);
          process.exit(1);
        }
      }
    });
  },
  getDb: function () {
    return _db;
  }
};