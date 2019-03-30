const express = require('express');
const router = express.Router();
require('../../init/passport-jwt');
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

router.get('/me', requireAuth, controller.me);

router.get('/profileSetting', requireAuth, controller.profileSetting);

router.get('/tourLeader/:userId', requireAuth, controller.tourLeaderPage);

router.get('/experience/:experienceId', controller.experiencePage);

module.exports = router;
