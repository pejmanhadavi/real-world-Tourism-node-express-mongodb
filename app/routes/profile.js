const express = require('express');
const router = express.Router();
require('../../init/passport');
const passport = require('passport');
const requireAuth = passport.authenticate('jwt', {
	session: false
});

const {upload} = require('../services/upload_image');
const controller = require('../controllers/profile');
const validate = require('../validations/profile');

/*
ROUTES
 */

router.get('/', requireAuth, controller.getProfile);

router.put('/',
	requireAuth,
	validate.updateProfile,
	upload.fields([{ name: 'profile', maxCount: 1 }, { name: 'backgroundImage', maxCount: 1 }]),
	controller.updateProfile);

router.delete('/profileImage/:profile', requireAuth, validate.deleteProfileImage, controller.deleteProfileImage);

router.delete('/backgroundImage', requireAuth, controller.deleteBackgroundImage);

module.exports = router;