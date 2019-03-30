const express = require('express');
const router = express.Router();
require('../../init/passport-jwt');
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
	controller.updateProfile);

router.put('/password', requireAuth, validate.updatePassword, controller.updatePassword);

router.put('/profileImage', requireAuth, upload.single('profileImage'), controller.updateProfileImage);

router.put('/backgroundImage', requireAuth, upload.single('backgroundImage'), controller.updateBackgroundImage);

router.delete('/profileImage/:profile', requireAuth, validate.deleteProfileImage, controller.deleteProfileImage);

router.delete('/backgroundImage', requireAuth, controller.deleteBackgroundImage);

module.exports = router;
