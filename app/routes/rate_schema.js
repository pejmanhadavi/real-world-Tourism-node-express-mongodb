const express = require('express');
const router = express.Router();
require('../../init/passport');
const passport = require('passport');
const requireAuth = passport.authenticate('jwt', {
    session: false
});


const controller = require('../controllers/rate_schema');
const validate = require('../validations/rate_schema');

