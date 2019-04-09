const express = require('express');
const validate = require('../validations/auth');
const controller = require('../controllers/auth');
require('../../init/passport-jwt');
const passport = require('passport');
const requireAuth = passport.authenticate('jwt', {
    session: false
});

const router = express.Router();

/*
ROUTES
*/

router.post('/register', validate.register, controller.register);

router.post('/verify', validate.verify, controller.verify);

router.post('/finalize', requireAuth, validate.finalize, controller.finalize);

router.post('/forgot', validate.forgotPassword, controller.forgotPassword);

router.post('/forgotVerify', validate.forgotVerify, controller.forgotVerify);

router.get('/reset/:verification', validate.getResetPassword, controller.getResetPassword);

router.post('/reset/:verification', validate.postResetPassword, controller.postResetPassword);

router.post('/login', validate.login, controller.login);

router.post('/token', controller.token);

module.exports = router;
