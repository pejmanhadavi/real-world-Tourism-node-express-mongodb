const express = require('express');
const router = express.Router();
require('../../init/passport');
const passport = require('passport');
const requireAuth = passport.authenticate('jwt', {
	session: false
});

const {upload} = require('../services/upload_image');
const controller = require('../controllers/tour_leader');
const validate = require('../validations/tour_leader');

/*
ROUTES
 */
router.post(
	'/',
	requireAuth,
	upload.fields([{name: 'scanBirthCertification'}, {name: 'scanTourLeaderCertification'}]),
	validate.registerTourLeader,
	controller.registerTourLeader
);

router.put('/', requireAuth, validate.edit, controller.edit);


module.exports = router;