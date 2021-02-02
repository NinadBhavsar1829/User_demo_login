const router = require('express').Router(),
  path = require('path'),
  fs = require('fs'),
  swaggerUi = require('swagger-ui-express');

var config = Object.assign({}, global.gConfig.swagger);

let resolve = require('json-refs').resolveRefs;

resolve(JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, 'swagger.json')
  ).toString())).then(async (results) => {
    if (process.env.NODE_ENV) {
      results.resolved.host = config.host;
      results.resolved.schemes = config.schemes;
      results.resolved.basePath = config.basePath;
    }
    router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(results.resolved));
    router.use('/api-docs.json', (req, res) => { res.json(results.resolved); });
  });

module.exports = router;