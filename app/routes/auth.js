const express = require('express');
const validate = require('../controllers/auth.validate');
const controller = require('../controllers/auth');
const router = express.Router();

/*
Routes
*/

router.post('/register', validate.register, controller.register);

module.exports = router;