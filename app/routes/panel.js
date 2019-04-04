const express = require('express');
const router = express.Router();
require('../../init/passport-local');
const passport = require('passport');
const requireAuth =  passport.authenticate('local', { failureRedirect: '/panel/login' , failureFlash: 'Invalid username or password'});

const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/panel/login')
};

router.get('/login', (req, res) => {
   res.render('login');
});

router.post('/login', requireAuth, (req, res) => {
    req.flash('success', 'You are now logged in');
    res.redirect('/panel/dashboard');
});

router.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.render('index', {title: 'this is the new shit stand up and ADMIIIIIIIIIIIT'});
});



module.exports = router;
