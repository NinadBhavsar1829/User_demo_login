const express = require('express');
const app = express();

const initialise = require('./app-utils/_initialise');
let server;

initialise.initialize((app), (err) => {
  if (err) { throw err; }
  else {
    let config = Object.assign({}, global.gConfig);
    require('./app-utils/_expressify').expressify((app), (err) => {
      if (err) { throw err; }
      else {
        server = app.listen((process.env.PORT || config.server.port), () =>
          console.log('Running on port ' + (process.env.PORT || config.server.port))
        );
      }
    })
  }
});

process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at:', p, 'reason:', reason)
  process.exit(1)
});

process.on('SIGTERM', () => {
  closeApp('SIGTERM');
});

process.on('SIGINT', () => {
  closeApp('SIGINT');
});

const closeApp = (event) => {
  console.info(event + ' signal received. Closing app.');
  server.close(() => {
    console.log('Http server closed.');
  });
  require('./app-utils/exitHandler');
  process.exit(0);
}

module.exports = app