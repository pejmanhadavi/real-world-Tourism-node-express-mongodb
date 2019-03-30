const express = require('express');
const router = express.Router();
require('../../init/passport-local');
const passport = require('passport');
const requireAuth =  passport.authenticate('local', { failureRedirect: '/panel/login' });


router.get('/login', (req, res) => {
   res.render('index', {title: 'this is the new shit'});
});

router.post('/login', requireAuth, (req, res) => {
    res.redirect('index', {title: 'this is the new shit stand up and ADMIIIIIIIIIIIT'});
});

router.get('/dashboard', requireAuth, (req, res) => {
    res.render('index', {title: 'this is the new shit stand up and ADMIIIIIIIIIIIT'});
});


module.exports = router;
