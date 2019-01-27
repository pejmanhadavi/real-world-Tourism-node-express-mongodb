const express = require('express');
const validate = require('../controllers/auth.validate');
const controller = require('../controllers/auth');

const User = require('../models/user').User;
const router = express.Router();

/*
Routes
*/

router.post('/register', validate.register, controller.register);

router.post('/verify', validate.verify, controller.verify);

router.post('/forgot', validate.forgotPassword, controller.forgotPassword);

router.post('./forgot/verify', validate.forgotVerify, controller.forgotVerify);

module.exports = router;
