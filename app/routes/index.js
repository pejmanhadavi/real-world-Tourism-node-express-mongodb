const express = require('express');
const router = express.Router();
require('../../init/passport');
const passport = require('passport');
const requireAuth = passport.authenticate('jwt', {
	session: false
});

const controller = require('../controllers/index');
/*
ROUTES
 */
router.get('/',controller.mainPage);

router.get('/loggedIn', requireAuth, controller.loggedIn);

module.exports = router;
