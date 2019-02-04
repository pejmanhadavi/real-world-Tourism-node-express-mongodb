const express = require('express');
const router = express.Router();
const controller = require('../controllers/profile');
require('../../config/passport');
const passport = require('passport');
const requireAuth = passport.authenticate('jwt', {
    session: false
});

/*
ROUTES
 */

router.get('/', requireAuth, controller.getProfile);



module.exports = router;