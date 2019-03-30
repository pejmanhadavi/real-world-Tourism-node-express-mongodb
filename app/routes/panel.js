const express = require('express');
const router = express.Router();
require('../../init/passport-local');
const passport = require('passport');
const requireAuth =  passport.authenticate('local', { failureRedirect: '/panel/login' });


router.get('/login', (req, res) => {
   res.render('index', {title: 'this is the new shit'});
});

router.get('/dashboard', requireAuth, (req, res) => {
    res.status(200).send('this is the new shit stand up and admit')
});


module.exports = router;
