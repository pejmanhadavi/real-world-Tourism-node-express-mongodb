const express = require('express');
const router = express.Router();
require('../../init/passport-local');
const passport = require('passport');
const {ensureAuthenticated} = require('../../init/passport-local');
const {user_dao} = require('../../messages');
const requireAuth =  passport.authenticate('local', { failureRedirect: '/panel/login' , failureFlash: user_dao.USER_NOT_FOUND});

const controller = require('../controllers/panel');


router.get('/login', controller.getLogin);

router.post('/login', requireAuth, controller.postLogin);

router.get('/dashboard', ensureAuthenticated, controller.dashboard);




module.exports = router;
