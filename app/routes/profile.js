const express = require('express');
const router = express.Router();
require('../../config/passport');
const passport = require('passport');
const requireAuth = passport.authenticate('jwt', {
    session: false
});

const controller = require('../controllers/profile');
const validate = require('../validations/profile');

/*
ROUTES
 */

router.get('/', requireAuth, controller.getProfile);

router.put('/', requireAuth, validate.updateProfile, controller.updateProfile);



module.exports = router;