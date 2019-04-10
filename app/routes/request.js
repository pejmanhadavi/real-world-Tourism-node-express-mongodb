const express = require('express');
const router = express.Router();
require('../../init/passport-jwt');
const passport = require('passport');
const requireAuth = passport.authenticate('jwt', {
	session: false
});
const validate = require('../validations/request');
const controller = require('../controllers/request');


/*
ROUTES
 */
router.post('/', requireAuth, validate.sendRequest, controller.sendRequest);

module.exports = router;



