const express = require('express');
const router = express.Router();
const appRouter = require('./approutes');

router.use('/approutes', appRouter);

module.exports = router;