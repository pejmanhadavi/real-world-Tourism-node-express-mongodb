const express = require('express');
const validate = require('../controllers/auth.validate');
const controller = require('../controllers/auth');

const User = require('../models/user').User;
const router = express.Router();

/*
Routes
*/

router.post('/register', validate.register, controller.register);

module.exports = router;