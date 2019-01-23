const express = require('express');
const validate = require('../controllers/auth.validate');
const router = express.Router();

/*
Routes
*/

router.post('/api/register', validate.register, controller.register);