const express = require('express');
const router = express.Router();
const schemaValidation = require('../model/UserValidation');
const userController = require('../controllers/user');

// APIs
router.post('/registeruser', schemaValidation.validateWithoutFiles, userController.registerUser);
router.post('/login', schemaValidation.validateWithoutFiles, userController.login);
router.post('/getuserlist', userController.verifyToken, schemaValidation.validateWithoutFiles, userController.getUserList);

module.exports = router;