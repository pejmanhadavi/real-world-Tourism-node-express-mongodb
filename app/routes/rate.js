const express = require('express');
const router = express.Router();
require('../../init/passport');
const passport = require('passport');
const requireAuth = passport.authenticate('jwt', {
	session: false
});


const controller = require('../controllers/rate');
const validate = require('../validations/rate');

/*
ROUTES
 */

router.post('/', requireAuth, validate.rateTourLeader, controller.rateTourLeader);


module.exports = router;