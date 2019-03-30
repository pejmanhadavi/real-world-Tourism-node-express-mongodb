const express = require('express');
const router = express.Router();
require('../../init/passport');
const passport = require('passport');
const requireAuth = passport.authenticate('jwt', {
    session: false
});


router.get('/login', (req, res) => {
   res.render('index', {title: 'this is the new shit'});
});

router.get('/dashboard', (req, res) => {

});


module.exports = router;
