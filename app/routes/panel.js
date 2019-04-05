const express = require('express');
const router = express.Router();
require('../../init/passport-local');
const passport = require('passport');
const {ensureAuthenticated, rememberMe} = require('../../init/passport-local');
const {user_dao} = require('../../messages');
const requireAuth =  passport.authenticate('local', { failureRedirect: '/panel/login' , failureFlash: user_dao.USER_NOT_FOUND});



router.get('/login', (req, res) => {
   res.render('login');
});

router.post('/login', requireAuth, (req, res) => {
    rememberMe(req);
    req.flash('success', 'You are now logged in');
    res.redirect('/panel/dashboard');
});

router.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.render('index', {title: 'this is the new shit stand up and ADMIIIIIIIIIIIT'});
});



module.exports = router;
