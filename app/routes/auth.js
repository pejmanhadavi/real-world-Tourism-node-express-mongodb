const express = require('express');
const validate = require('../validations/auth');
const controller = require('../controllers/auth');

const router = express.Router();

/*
ROUTES
*/

router.post('/register', validate.register, controller.register);

router.get('/verify/:verification', validate.verify, controller.verify);

router.post('/forgot', validate.forgotPassword, controller.forgotPassword);

router.get('/reset/:verification', validate.getResetPassword, controller.getResetPassword);

router.post('/reset/:verification', validate.postResetPassword, controller.postResetPassword);

router.post('/login', validate.login, controller.login);

router.post('/token', validate.token, controller.token);

module.exports = router;