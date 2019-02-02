const express = require('express');
const validate = require('../validations/auth');
const controller = require('../controllers/auth');

const User = require('../dao/user').User;
const router = express.Router();

/*
Routes
*/

router.post('/register', validate.register, controller.register);

router.post('/verify', validate.verify, controller.verify);

router.post('/forgot', validate.forgotPassword, controller.forgotPassword);

router.post('/login', validate.login, controller.login);

module.exports = router;
